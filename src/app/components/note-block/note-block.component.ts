import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Note } from 'src/app/common/models/note.model';
import { NoteService } from 'src/app/common/services/note.service';

@Component({
  selector: 'app-note-block',
  templateUrl: './note-block.component.html',
  styleUrls: ['./note-block.component.scss']
})
export class NoteBlockComponent {
  @Input() note!: Note;
  @Output() editNote = new EventEmitter<boolean>();
  @Output() changedDailyStatus = new EventEmitter<boolean>();
  subscriptions: Subscription[] = [];
  

  constructor(private noteService: NoteService) {}

  /**
   * Change the completion status of the note.
   * @param e Checkbox event on change
   */
  changeCompletedStatus(e: any): void {
    this.subscriptions.push(
      this.noteService.update(this.note.id!, {...this.note, isArchived: e.checked})
        .subscribe((updateResult) => {
          this.note = updateResult;
          if (e.checked) this.playAudio();
        })
    );
  }

  /**
   * Emits true when note content is clicked.
   */
  onEditNote(): void {
    this.editNote.emit(true);
  }

  /**
   * Change if the note is added to daily or not.
   * @param e Slide toggle event on change.
   */
  changeDailyStatus(e: any): void {
    this.subscriptions.push(
      this.noteService.update(this.note.id!, {...this.note, isFavorite: e.checked})
        .subscribe((updateResult) => {
          if (e.checked) this.playAudio(false);
          this.changedDailyStatus.emit(e.checked);
        })
    );
  }

  /**
   * Plays audio notification for note status change
   * @param isCompletion True when changing completed status, false when changing daily status.
   */
  playAudio(isCompletion = true): void {
    let audio = new Audio();
    audio.src = `../../assets/audio/${!isCompletion ? 'long-pop' : 'happy-bell'}.wav`;
    audio.load();
    audio.play();
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
