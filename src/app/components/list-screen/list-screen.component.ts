import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Note } from 'src/app/common/models/note.model';
import { NoteService } from 'src/app/common/services/note.service';

@Component({
  selector: 'app-list-screen',
  templateUrl: './list-screen.component.html',
  styleUrls: ['./list-screen.component.scss']
})
export class ListScreenComponent {
  @Input() result: Note[] = [];
  @ViewChild('theForm') theForm!: FormGroupDirective;
  @Output() newItemEvent = new EventEmitter<boolean>();

  constructor(private fb: FormBuilder, private noteService: NoteService) {}
  
  title = 'LISTA';

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
    this.subscriptions.push(
      this.noteService.getTodayNotes().subscribe((notes: Note[]) => {
        this.notes = notes;
        console.log("🚀 ~ file: list-screen.component.ts:32 ~ ListScreenComponent ~ this.noteService.getTodayNotes ~ this.notes:", this.notes)
      })
    );
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
          this.notes.push(note);
          newNote.reset();
          this.theForm.resetForm();
        })
    );

  }

  editNote(value: number) {
    console.log('editing note', value);
    this.newItemEvent.emit(true);
  }
}
