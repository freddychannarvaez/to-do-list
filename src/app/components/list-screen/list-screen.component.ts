import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { List } from 'src/app/common/models/list.model';
import { Note } from 'src/app/common/models/note.model';
import { ListService } from 'src/app/common/services/list.service';
import { NoteService } from 'src/app/common/services/note.service';
import { RenameDialogComponent } from '../rename-dialog/rename-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

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
  
  constructor(private fb: FormBuilder,
    private noteService: NoteService,
    private listService: ListService,
    private renameDialog: MatDialog,
    private confirmDialog: MatDialog) {}
    
  title!: string;
  
  // notes = ['1', '2', '3'];
  notes: Note[] = [];
  
  subscriptions: Subscription[] = [];
  
  formGroup: FormGroup = this.fb.group({
    newNote: new FormControl('', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]),
    // newNote: new FormControl('', [Validators.required, Validators.pattern('^(?!\s*$).+')]),
    // newNote: new FormControl('', [Validators.required, Validators.minLength(1)]),
  });
  
  ngOnInit() {
    // this.buildForm();
    // console.log(this.list);
    // this.title = this.list?.title;
    this.subscriptions.push(
      this.noteService.getTodayNotes().subscribe((notes: Note[]) => {
        this.notes = notes;
        console.log("🚀 ~ file: list-screen.component.ts:32 ~ ListScreenComponent ~ this.noteService.getTodayNotes ~ this.notes:", this.notes)
        this.title = this.list?.title ?? 'All Notes';
        console.log("🚀 ~ file: list-screen.component.ts:45 ~ ListScreenComponent ~ this.noteService.getTodayNotes ~ this.list:", this.list)
      })
      );
    }
      
  ngOnChanges(changes: SimpleChanges): void {
    console.log("🚀 ~ file: list-screen.component.ts:19 ~ ListScreenComponent ~ isDraggable:", this.isDraggable)
    console.log("🚀 ~ file: list-screen.component.ts:51 ~ ListScreenComponent ~ ngOnChanges ~ changes:", changes)
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    this.title = this.list?.title;
    console.log(this.list);
  }

  // buildForm() {
  //   this.formGroup = this.fb.group({
  //     newNote: new FormControl('new note', [Validators.required]),
  //   });
  // }

  createNote() {
    const newNote = this.formGroup.controls['newNote'];
    // console.log(newNote.valid);

    if (!newNote.valid) return;

    console.log('note created!', newNote.value);
    // this.notes.push(this.noteService.create(newNote.value, this.notes.length + 1, true));
    this.subscriptions.push(
      this.noteService.create(newNote.value, this.notes.length + 1, true)
        .subscribe((note: Note) => {
          console.log("🚀 ~ file: list-screen.component.ts:59 ~ ListScreenComponent ~ .subscribe ~ note:", note)
          this.notes.push(note);
          this.result = [...this.notes]
          newNote.reset();
          this.theForm.resetForm();
        })
    );

  }

  editNote(value: number) {
    console.log('editing note', value);
    this.newItemEvent.emit(value);
  }


  onDropNote(event: CdkDragDrop<Note[]>) {
    console.log("🚀 ~ file: list-screen.component.ts:77 ~ ListScreenComponent ~ drop ~ event:", event)
    if (event.previousIndex === event.currentIndex) return;

    moveItemInArray(this.result, event.previousIndex, event.currentIndex);
    console.log("🚀 ~ file: list-screen.component.ts:79 ~ ListScreenComponent ~ drop ~ this.result:", this.result)
    // TODO: Reorder position also
    console.log('list id: ', this.list.id!);
    this.listService.update(this.list.id!, {...this.list, notes: this.result.map((x) => x.id!)})
      .subscribe((x) => {
        console.log(x);
      });
  }

  orderPosition(index: number) {

  }

  onRenameList() {
    console.log(this.list);
    this.renameDialog.open(RenameDialogComponent, {
      width: '250px',
      data: this.list,
    });
  }

  onOrderBy() {}

  onDuplicateList() {
    console.log('on duplicate list');
    const newNotesArray: number[] = [];
    const duplicatedList: List = {
      dateCreated: Date.now().valueOf(),
      position: this.list.notes.length + 1,
      notes: [...this.list.notes],
      title: `Copy of ${this.list.title}`,
      isArchived: this.list.isArchived,
      isFavorite: this.list.isFavorite,
    }
    console.log("🚀 ~ file: list-screen.component.ts:128 ~ ListScreenComponent ~ onDuplicateList ~ duplicatedList:", duplicatedList)
    // Clone notes
    this.result.map((note: Note, index: number) => {
      this.noteService.create(note.content, note.position, note.isFavorite)
        .subscribe((createdNote: Note) => {
          console.log("🚀 ~ file: list-screen.component.ts:143 ~ ListScreenComponent ~ .subscribe ~ createdNote:", createdNote)
          newNotesArray.push(createdNote.id!);

          if(index === this.result.length - 1) {
            console.log("🚀 ~ file: list-screen.component.ts:146 ~ ListScreenComponent ~ .subscribe ~ newNotesArray:", newNotesArray)
            // Create list
            this.listService.create(`Copy of ${this.list.title}`,
                                    this.list.notes.length + 1,
                                    // [...this.list.notes],
                                    [...newNotesArray],
                                    this.list.isFavorite).subscribe((x) => {
                                      console.log(x);
                                    })
          } else {
            console.log(index);
          }
        })
      })
  }

  onDeleteList() {
    const dialogResponse = this.confirmDialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: {dialogContent: `Would you like to delete (${this.list.title}) note?`},
    }).afterClosed().subscribe((x) => {
      console.log(x);
      if (x) {
        // Delete list
        this.listService.delete(this.list.id!).subscribe((y) => {
          console.log(y);
        })
      }
    });
  }

  onSortListBy(option: number) {
    console.log("🚀 ~ file: list-screen.component.ts:180 ~ ListScreenComponent ~ onSortListBy ~ option:", option)
    enum SortingOptions {
      'alphabetically',
      'creationDate',
      'importance'
    };

    if (option < 0 || option > Object.keys(SortingOptions).length) return console.log('is null');

    switch (option) {
      case SortingOptions.alphabetically:
        this.result = [...this.result.sort((x, y) => {
          if (x.content < y.content) { return -1; }
          if (x.content > y.content) { return 1; }
          return 0;
        })];
        console.log(this.result);
        break;

      case SortingOptions.creationDate:
        console.log('entering case 1')
        this.result = [...this.result.sort((x, y) => x.dateCreated - y.dateCreated)];
        console.log(this.result);
        break;
        
      case SortingOptions.importance:
        this.result = [...this.result.sort((x, y) => {return (x.isFavorite === y.isFavorite)? 0 : x.isFavorite? -1 : 1;})];
        console.log(this.result);
        break;
    }
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
