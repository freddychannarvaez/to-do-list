import { Component, Input } from '@angular/core';
import { Note } from 'src/app/common/models/note.model';
import { NoteService } from 'src/app/common/services/note.service';

@Component({
  selector: 'app-note-block',
  templateUrl: './note-block.component.html',
  styleUrls: ['./note-block.component.scss']
})
export class NoteBlockComponent {
  @Input() note!: Note;

  constructor(private noteService: NoteService) {}

  ngOnInit(): void {
    console.log(this.note);
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    
  }

  changeCompletedStatus(e: any) {
    console.log("🚀 ~ file: note-block.component.ts:23 ~ NoteBlockComponent ~ onChangeCheckboxValue ~ e:", e.checked);
    this.noteService.update(this.note.id!, {...this.note, isArchived: e.checked}).subscribe((x) => {
      console.log(x);
    });
  }

  changeDailyStatus(e: any) {
    console.log("🚀 ~ file: note-block.component.ts:27 ~ NoteBlockComponent ~ changeDailyStatus ~ e:", e.checked)
    this.noteService.update(this.note.id!, {...this.note, isFavorite: e.checked}).subscribe((x) => {
      console.log(x);
    });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    
  }
}
