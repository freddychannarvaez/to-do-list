import { Component, ViewChild } from '@angular/core';
import { NoteService } from './common/services/note.service';
import { Observable, Subscription, debounceTime, distinctUntilChanged, from, merge, pipe, switchMap, tap, toArray } from 'rxjs';
import { Note } from './common/models/note.model';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ListService } from './common/services/list.service';
import { List } from './common/models/list.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'to-do-list';
  @ViewChild('sidenav2') sidenav2!: any;

  subscriptions: Subscription[] = [];
  notes: Note[] = [];
  auxNotes: Note[] = [];

  lists: List[] = [];

  currentNote!: Note;
  currentList!: List;

  // searchBarForm: any;
  // searchBarValue: string[] = [];
  searchBarValue = '';

  isDraggable = false;

  formGroup: FormGroup = this.fb.group({
    content: new FormControl(this.currentNote?.content ?? '', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]),
    // newNote: new FormControl('', [Validators.required, Validators.pattern('^(?!\s*$).+')]),
    // newNote: new FormControl('', [Validators.required, Validators.minLength(1)]),
  });

  constructor(private noteService: NoteService,
              private listService: ListService,
              private fb: FormBuilder) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.subscriptions.push(
      // Get by id
      // this.noteService.get(2).subscribe((notes: Note) => {
      //   this.notes = [notes];

      // Get all
      this.noteService.getAllNotes().subscribe((notes: Note[]) => {
        this.notes = notes;
        this.auxNotes = [...notes];
        console.log("🚀 ~ file: app.component.ts:39 ~ this.noteService.getTodayNotes ~ this.notes:", this.notes)

      // Get all
      // this.noteService.getTodayNotes().subscribe((notes: Note[]) => {
      //   this.notes = notes;
      //   this.auxNotes = [...notes];

      // Search
      // this.noteService.search('is').subscribe((notes: Note[]) => {
      //   this.notes = notes;
        // console.log("🚀 ~ file: app.component.ts:25 ~ AppComponent ~ this.noteService.getAllNotes ~ this.notes:", this.notes)
      }),
      this.listService.getAllLists().subscribe((lists: List[]) => {
        this.lists = lists;
        console.log("🚀 ~ file: app.component.ts:55 ~ this.listService.getAllLists ~ this.lists :", this.lists )
      })
    );

    // this.searchBarForm = new FormGroup({
    //   searchBarValue: new FormControl("")
    // });
  }

  onSearch(target: any) {
    if(target?.value == '') this.notes = [...this.auxNotes];

    console.log("🚀 ~ file: app.component.ts:48 ~ onSearch ~ value:", target?.value)
    this.subscriptions.push(
      from(target.value as string).pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((value) => {
          console.log("🚀 ~ file: app.component.ts:55 ~ tap ~ value:", value)
          if (this.searchBarValue.length > target?.value) {
            console.log('you are writing');
            this.searchBarValue = this.searchBarValue.concat(value);
          } else {
            console.log('you are deleting');
            this.searchBarValue = target?.value;
          }
          console.log('observable:', this.searchBarValue);
        }),
        switchMap(() => {
          return this.noteService.search(this.searchBarValue);
        })
        )
        .subscribe((result) => {
          this.notes = result;
          console.log(result);
        })
      // .subscribe((value) => {
      //   console.log('observable:', value);
      // })
    );
    // this.searchBarValue = value.searchBarValue;
  }

  onShowAllNotes() {
    // this.currentList = {}
    this.notes = [...this.auxNotes];
    this.isDraggable = false;
    this.currentList = {title: 'All notes', dateCreated: 0, isArchived: false, isFavorite: false, position: 0, notes: []};
  }

  onShowDailyNotes() {
    this.notes = [...this.auxNotes.filter((x) => x.isFavorite)];
    this.isDraggable = false;
    this.currentList = {title: 'Daily notes', dateCreated: 0, isArchived: false, isFavorite: false, position: 0, notes: []};
  }

  onSelectList(index: number) {
    this.isDraggable = true;
    this.currentList = this.lists[index];
    console.log('selected list', this.currentList);
    const auxSubs: Observable<any>[] = [];
    this.lists[index].notes.map((x) => {
      console.log("🚀 ~ file: app.component.ts:105 ~ this.lists[index].notes.map ~ x:", x)
      auxSubs.push(this.noteService.get(x));
    });
    this.subscriptions.push(
      merge(
        ...auxSubs,
      )
      .pipe(toArray())
      .subscribe((notes) => {
        console.log("🚀 ~ file: app.component.ts:110 ~ .subscribe ~ notes:", notes)
        this.notes = [...notes];
      })
    );
  }

  createList(form: NgForm) {    
    const newList = form.controls['newList'].value;

    if (newList === '' || newList === null) return;

    console.log('list created!', newList);
    this.subscriptions.push(
      this.listService.create(newList, this.lists.length + 1, [], true)
        .subscribe((list: List) => {
          console.log("🚀 ~ file: app.component.ts:140 ~ .subscribe ~ list:", list)
          this.lists.push(list);
          form.reset();
        })
    );

  }
  
  onSelectNote(index: number) {
    console.log('onEditNote', this.notes[index]);
    this.currentNote = this.notes[index];
    this.formGroup.controls['content'].setValue(this.notes[index].content);
  }

  onUpdateNote() {
    const newContent = this.formGroup.controls['content'].value;
    console.log("🚀 ~ file: app.component.ts:131 ~ onDo ~ e:", newContent)
    const editedNote: Note = {...this.currentNote, content: newContent};
    console.log("🚀 ~ file: app.component.ts:157 ~ onUpdateNote ~ editedNote:", editedNote)
    this.noteService.update(this.currentNote.id!, editedNote).subscribe((x) => {
      console.log(x);
    });
  }

  onClearForm(form: NgForm) {
    console.log("🚀 ~ file: app.component.ts:141 ~ onClearForm ~ form:", form)
    console.log('resetting form');
    form.reset();
  }

  onDropList(event: CdkDragDrop<List[]>) {
    if (event.previousIndex === event.currentIndex) return;

    // console.log("🚀 ~ file: app.component.ts:139 ~ drop ~ event:", event)
    moveItemInArray(this.lists, event.previousIndex, event.currentIndex);
    // console.log("🚀 ~ file: app.component.ts:166 ~ drop ~ this.lists:", this.lists)
    // TODO: Reorder position also
    this.onSaveListsOrder();
  }

  onSaveListsOrder() {
    for (const { index, value } of this.lists.map((value, index) => ({ index, value }))) {
      value.position = index;
      this.onUpdateList(value);
      // console.log('index ', index);
      // console.log('value ', value);
    }
    console.log("🚀 ~ file: app.component.ts:166 ~ drop ~ this.lists:", this.lists)
  }

  onUpdateList(list: List) {
    console.log("🚀 ~ file: app.component.ts:182 ~ onUpdateList ~ list:", list)
    this.listService.update(list.id!, list).subscribe((x) => {
      console.log(x);
    })
  }


  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}

