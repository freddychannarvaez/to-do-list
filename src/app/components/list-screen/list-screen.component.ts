import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, firstValueFrom } from 'rxjs';
import { List } from 'src/app/common/models/list.model';
import { Note } from 'src/app/common/models/note.model';
import { ListService } from 'src/app/common/services/list.service';
import { NoteService } from 'src/app/common/services/note.service';
import { RenameDialogComponent } from '../rename-dialog/rename-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-list-screen',
  templateUrl: './list-screen.component.html',
  styleUrls: ['./list-screen.component.scss']
})
export class ListScreenComponent {
  @Input() result: Note[] = [];
  @Input() list!: List;
  @Input() isDraggable!: boolean;
  @ViewChild('theForm') theForm!: FormGroupDirective;
  @Output() newItemEvent = new EventEmitter<number>();
  @Output() changedDailyStatus = new EventEmitter<{index: number, value: boolean}>();
  @Output() changedCompletedStatus = new EventEmitter<{index: number, value: boolean}>();
  
  constructor(private fb: FormBuilder,
    private noteService: NoteService,
    private listService: ListService,
    private renameDialog: MatDialog,
    private snackbar: MatSnackBar,
    private confirmDialog: MatDialog) {}
    
  title!: string;
  notes: Note[] = [];
  subscriptions: Subscription[] = [];
  
  formGroup: FormGroup = this.fb.group({
    newNote: new FormControl('', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]),
  });
  
  ngOnInit() {
    this.subscriptions.push(
      this.noteService.getTodayNotes().subscribe((notes: Note[]) => {
        this.title = this.list?.title ?? 'All Notes';
      })
      );
    }
      
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    this.title = this.list?.title;
  }

  /**
   * Creates a note.
   * @returns void.
   */
  createNote(): void {
    const newNote = this.formGroup.controls['newNote'];

    if (!newNote.valid) return;

    this.subscriptions.push(
      this.noteService.create(newNote.value, this.result.length + 1, this.list?.id === -1 ? true : false)
        .subscribe((note: Note) => {
            this.result.push(note);
            newNote.reset();
            this.theForm.resetForm();

            // Add note to the list
            if (this.list?.id! >= 0) {
              // Refresh all notes & updated lists
              this.subscriptions.push(
                this.listService
                  .update(this.list.id!, {...this.list, notes: [...this.list.notes, note.id!]})
                  .subscribe((x) => {
                      this.noteService.updateNotesSubject([...this.result]);
                      this.openSnackBar('Note created', 'Close');
                  })
              );
            }
        })
    );

  }

  /**
   * Emits the index of the edited note.
   * @param value Index of the note.
   * @returns void.
   */
  editNote(value: number): void {
    this.newItemEvent.emit(value);
  }

  /**
   * Reorders the notes array by dragging its elements.
   * @param event Event of the drag & drop.
   * @returns void.
   */
  onDropNote(event: CdkDragDrop<Note[]>) {
    if (event.previousIndex === event.currentIndex) return;

    moveItemInArray(this.result, event.previousIndex, event.currentIndex);
    for (const { index, value } of this.result.map((value, index) => ({ index, value }))) {
      value.position = index;
      firstValueFrom(this.noteService.update(value.id!, value));
    }

    // Save reorder position
    this.subscriptions.push(
      this.listService.update(this.list.id!, {...this.list, notes: this.result.map((x) => x.id!)})
        .subscribe((res) => {
          this.noteService.updateNotesSubject([...this.result]);
          if (res.affected === 1) {
            this.openSnackBar('Notes reordered', 'Close');
          }
        })
    );
  }

  /**
   * Opens the rename list dialog.
   * @returns void.
   */
  onRenameList() {
    this.subscriptions.push(
      this.renameDialog.open(RenameDialogComponent, {
        width: '250px',
        data: this.list,
      }).afterClosed().subscribe((newTitle: string) => {
        if (newTitle) {
          this.subscriptions.push(
            this.listService.update(this.list.id!, {...this.list, title: newTitle})
              .subscribe((res) => {
                if (res.affected === 1) { 
                  this.title = newTitle;
                  this.openSnackBar('List renamed!', 'Close');
              }
            })
          );
        }
      })
    );
  }

  /**
   * Duplicates a list.
   */
  onDuplicateList(): void {
    const newNotesArray: number[] = [];
    // Clone notes
    this.result.map((note: Note, index: number) => {
      this.subscriptions.push(
        this.noteService.create(note.content, note.position, note.isFavorite)
          .subscribe((createdNote: Note) => {
            newNotesArray.push(createdNote.id!);
  
            if(index === this.result.length - 1) {
              // Create list
              this.subscriptions.push(
                this.listService.create(`Copy of ${this.list.title}`,
                                        this.list.notes.length + 1,
                                        [...newNotesArray],
                                        this.list.isFavorite).subscribe((x) => {
                                        this.openSnackBar('List duplicated!', 'Close');
                                        })
              );
            } else {
            }
          })
      );
    })
  }

  /**
   * Deletes a list.
   * @returns void.
   */
  onDeleteList(): void {
    this.subscriptions.push(
      this.confirmDialog.open(ConfirmDialogComponent, {
        width: '250px',
        data: {dialogContent: `Would you like to delete (${this.list.title}) list?`},
      }).afterClosed().subscribe((isDeleted) => {
        if (isDeleted) {
          // Delete list
          this.subscriptions.push(
            this.listService.delete(this.list.id!, this.list.notes)
              .subscribe(() => {
                this.openSnackBar('List deleted!', 'Close');
              })
          );
        }
      })
    );
  }

  /**
   * Sorts a list by the selected parameter.
   * @param option Parameter to order the list.
   * @returns void.
   */
  onSortListBy(option: number): void {
    enum SortingOptions {
      'alphabetically',
      'creationDate',
      'importance'
    };

    if (option < 0 || option > Object.keys(SortingOptions).length) return;

    switch (option) {
      case SortingOptions.alphabetically:
        this.result = [...this.result.sort((x, y) => {
          if (x.content < y.content) { return -1; }
          if (x.content > y.content) { return 1; }
          return 0;
        })];
        break;

      case SortingOptions.creationDate:
        this.result = [...this.result.sort((x, y) => +x.dateCreated - +y.dateCreated)];
        break;
        
      case SortingOptions.importance:
        this.result = [...this.result.sort((x, y) => {return (x.isFavorite === y.isFavorite)? 0 : x.isFavorite? -1 : 1;})];
        break;
    }
  }

  onEmitDailyStatus(index: number, value: boolean) {
    this.changedDailyStatus.emit({index, value});
  }

  onEmitCompletedStatus(index: number, value: boolean) {
    this.changedCompletedStatus.emit({index, value});
  }

  openSnackBar(message: string, action: string) {
    this.snackbar.open(message, action);
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
