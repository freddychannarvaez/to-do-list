import { Component, ViewChild } from '@angular/core';
import { NoteService } from './common/services/note.service';
import { Subscription, debounceTime, distinctUntilChanged, from, switchMap, tap } from 'rxjs';
import { Note } from './common/models/note.model';
import { FormControl, FormGroup } from '@angular/forms';

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

  searchBarForm: any;
  // searchBarValue: string[] = [];
  searchBarValue = '';

  constructor(private noteService: NoteService) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.subscriptions.push(
      // Get by id
      // this.noteService.get(2).subscribe((notes: Note) => {
      //   this.notes = [notes];

      // Get all
      // this.noteService.getAllNotes().subscribe((notes: Note[]) => {
      //   this.notes = notes;

      // Get all
      this.noteService.getTodayNotes().subscribe((notes: Note[]) => {
        this.notes = notes;
        console.log("🚀 ~ file: app.component.ts:39 ~ this.noteService.getTodayNotes ~ this.notes:", this.notes)

      // Search
      // this.noteService.search('is').subscribe((notes: Note[]) => {
      //   this.notes = notes;
        // console.log("🚀 ~ file: app.component.ts:25 ~ AppComponent ~ this.noteService.getAllNotes ~ this.notes:", this.notes)
      })
    );

    // this.searchBarForm = new FormGroup({
    //   searchBarValue: new FormControl("")
    // });
  }

  onSearch(target: any) {
    console.log("🚀 ~ file: app.component.ts:48 ~ onSearch ~ value:", target?.value)
    this.subscriptions.push(
      from(target.value as string).pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((value) => {
          console.log("🚀 ~ file: app.component.ts:55 ~ tap ~ value:", value)
          // this.searchBarValue.push(value);
          this.searchBarValue = this.searchBarValue.concat(value);
          console.log('observable:', this.searchBarValue);
        }),
        switchMap((value) => {
          return this.noteService.search(this.searchBarValue);
        })
        )
        .subscribe((result) => {
          console.log(result);
        })
      // .subscribe((value) => {
      //   console.log('observable:', value);
      // })
    );
    // this.searchBarValue = value.searchBarValue;
  }

}
