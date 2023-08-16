import { Component, ViewChild } from '@angular/core';
import { NoteService } from './common/services/note.service';
import { Observable, Subscription, distinctUntilChanged, firstValueFrom, from, merge, of, switchMap, tap, toArray } from 'rxjs';
import { Note } from './common/models/note.model';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ListService } from './common/services/list.service';
import { List } from './common/models/list.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('sidenav2') sidenav2!: any;

  subscriptions: Subscription[] = [];
  notes: Note[] = [];
  auxNotes: Note[] = [];
  lists: List[] = [];

  currentNote!: Note;
  currentNoteIndex!: number;
  currentList!: List;
  previousNotes: Note[] = [];
  searchBarValue = '';
  hasMadeBackup = false;
  isSearching = false;

  isDraggable = false;

  formGroup: FormGroup = this.fb.group({
    content: new FormControl(this.currentNote?.content ?? '',
      [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]),
  });

  constructor(private noteService: NoteService,
              private listService: ListService,
              private confirmDialog: MatDialog,
              private snackbar: MatSnackBar,
              private fb: FormBuilder) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.currentList = {
      id: -2,
      title: 'All notes',
      dateCreated: 0,
      isArchived: false,
      isFavorite: false,
      position: 0,
      notes: [...this.notes.map((x) => x.id!)]
    };        
    this.subscriptions.push(
      this.noteService.currentNotes$.subscribe((notes) => {
        this.notes = [...notes.sort((x, y) => x.position - y.position)];
        if (!this.hasMadeBackup && notes.length > 0) {
          this.auxNotes = [...notes];
          this.hasMadeBackup = true;
        }
      }),
      this.listService.getAllLists().subscribe((lists: List[]) => {
        this.lists = lists.sort((x, y) => x.position - y.position );
      })
    );
  }

  /**
   * Searches notes by content property.
   * @param event Event containing the text string to match.
   * @returns void.
   */
  onSearch(event: Event, form: NgForm): void {
    this.currentList = {...this.currentList, title: 'Searching in all notes'};
    const searchValue = (event.target as HTMLInputElement).value;

    if (searchValue == '') {
      form.reset();
      this.onShowAllNotes();
      this.notes = [...this.previousNotes];
    }

    if (this.searchBarValue === '') {
      this.previousNotes = [...this.notes];
    }

    this.subscriptions.push(
      from(searchValue).pipe(
        distinctUntilChanged(),
        tap((value) => {
          if (this.searchBarValue.length < searchValue.length) {
            this.searchBarValue = this.searchBarValue.concat(value);
          } else {
            this.searchBarValue = searchValue;
          }
        }),
        switchMap(() => {
          return this.searchBarValue.match(/^(?=\s*$)/) ? of([]) : this.noteService.search(this.searchBarValue);
        })
        )
        .subscribe((result) => {
          this.notes = result;
          this.noteService.updateNotesSubject([...this.notes]);
        })
    );
  }

  /**
   * Clears the search input.
   * @param form Form containing the input.
   * @returns void.
   */
  onClearSearch(form: NgForm): void {
    form.controls['search'].setValue('');
    form.reset();
    this.onShowAllNotes();
  }


  /**
   * Shows all notes in the list screen.
   * @returns void.
   */
  async onShowAllNotes(): Promise<void> {
    this.sidenav2.close();
    const notesPromise = await firstValueFrom(this.noteService.getAllNotes());
    this.noteService.updateNotesSubject([...notesPromise]);
    this.isDraggable = false;
    this.currentList = {
                        id: -2,
                        title: 'All notes',
                        dateCreated: 0,
                        isArchived: false,
                        isFavorite: false,
                        position: 0,
                        notes: [...this.notes.map((x) => x.id!)]
                      };
  }

  /**
   * Shows all daily notes in the list screen.
   * @returns void.
   */
  async onShowDailyNotes(): Promise<void> {
    this.sidenav2.close();
    const notesPromise = await firstValueFrom(this.noteService.getTodayNotes());
    this.noteService.updateNotesSubject([...notesPromise]);
    this.isDraggable = false;
    this.currentList = {
                        id: -1,
                        title: 'Daily notes',
                        dateCreated: 0,
                        isArchived: false,
                        isFavorite: false,
                        position: 0,
                        notes: [...this.notes.filter((x) => x.isFavorite)
                          .map((y) => y.id!)]
                      };
  }

  /**
   * Shows a selected list in the list screen.
   * @param index Index of the list from the allLists array.
   * @returns void.
   */
  async onSelectList(index: number): Promise<void> {
    this.sidenav2.close();
    this.isDraggable = true;
    const listPromise = await firstValueFrom(this.listService.getAllLists());
    this.currentList = listPromise[index];
    const auxSubs: Observable<any>[] = [];

    listPromise[index].notes.map((x) => {
      auxSubs.push(this.noteService.get(x));
    });

    this.subscriptions.push(
      merge(
        ...auxSubs,
      )
      .pipe(toArray())
      .subscribe((notes) => {
        this.noteService.updateNotesSubject([...notes]);
      })
    );
  }

  /**
   * Creates a list.
   * @param form Form with the data of the list.
   * @returns void.
   */
  createList(form: NgForm): void {    
    const newList = form.controls['newList'].value;
    if (newList === '' || newList === null) return;

    this.subscriptions.push(
      this.listService.create(newList, this.lists.length + 1, [], true)
        .subscribe((list: List) => {
          this.lists.push(list);
          form.reset();
          this.openSnackBar('List created succesfully', 'Close');
        })
    );

  }
  
  /**
   * Shows the selected note information.
   * @param index Index of the note from the list.
   * @returns void.
   */
  onSelectNote(index: number): void {
    this.currentNote = this.notes[index];
    this.currentNoteIndex = index;
    this.formGroup.controls['content'].setValue(this.notes[index].content);

    if (!this.sidenav2.opened) {
      this.sidenav2.open();
    } else {
    }
  }

  /**
   * Updates the selected note data.
   * @returns void.
   */
  onUpdateNote(): void { // TODO: Updates note but not list
    const newContent = this.formGroup.controls['content'].value;
    const editedNote: Note = {...this.currentNote, content: newContent};
    this.subscriptions.push(
      this.noteService.update(this.currentNote.id!, editedNote).subscribe((res) => {
        const aux = [...this.notes];
        aux[this.currentNoteIndex] = res;
        this.noteService.updateNotesSubject([...aux]);
        this.openSnackBar('Note updated!', 'Close');
      })
    );
  }

  /**
   * Reorders the list by dragging its elements.
   * @param event Event of the drag & drop.
   * @returns void.
   */
  onDropList(event: CdkDragDrop<List[]>): void {
    if (event.previousIndex === event.currentIndex) return;
    moveItemInArray(this.lists, event.previousIndex, event.currentIndex);
    // Save reorder position
    this.onSaveListsOrder();
  }

  /**
   * Saves the lists position after a drag & drop event.
   * @returns void.
   */
  onSaveListsOrder(): void {
    for (const { index, value } of this.lists.map((value, index) => ({ index, value }))) {
      value.position = index;
      this.onUpdateList(value);
    }
    this.openSnackBar('List reordered', 'Close');
  }

  /**
   * Updates the list data.
   * @param list List to update.
   * @returns void.
   */
  onUpdateList(list: List): void {
    this.listService.update(list.id!, list);
  }

  onChangeDailyStatus(e: {index: number, value: boolean}) {
    this.notes[e.index].isFavorite = e.value;
    this.noteService.updateNotesSubject([...this.notes]);
  }
  
  onChangeCompletedStatus(e: {index: number, value: boolean}) {
    this.notes[e.index].isArchived = e.value;
    this.noteService.updateNotesSubject([...this.notes]);
  }

  onDeleteNote() {
    this.subscriptions.push(
      this.confirmDialog.open(ConfirmDialogComponent, {
        width: '250px',
        data: {dialogContent: `Would you like to delete this note?`},
      }).afterClosed().subscribe((isDeleted) => {
        if (isDeleted) {
          // Delete list
          this.subscriptions.push(
            this.noteService.delete(this.currentNote.id!).subscribe((y: any) => {
              if (y.affected === 1) {
                this.openSnackBar('Note deleted', 'Close');
                this.notes.splice(this.currentNoteIndex, 1);
                const deletedNoteIndex = this.currentList.notes
                  .findIndex((x) => x === this.currentNote.id);
                if (deletedNoteIndex > -1) {
                  this.currentList.notes.splice(deletedNoteIndex, 1);
                  this.listService.update(this.currentList.id!, 
                    {...this.currentList});
                }
                this.noteService.updateNotesSubject([...this.notes])
              }
            })
          );
        }
      })
    );
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

