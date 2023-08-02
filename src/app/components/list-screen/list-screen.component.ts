import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-list-screen',
  templateUrl: './list-screen.component.html',
  styleUrls: ['./list-screen.component.scss']
})
export class ListScreenComponent {
  
  constructor(private fb: FormBuilder) {}
  
  title = 'LISTA';

  notes = ['1', '2', '3'];

  formGroup: FormGroup = this.fb.group({
    newNote: new FormControl('new note', [Validators.required]),
  });

  ngOnInit() {
    // this.buildForm();
  }

  // buildForm() {
  //   this.formGroup = this.fb.group({
  //     newNote: new FormControl('new note', [Validators.required]),
  //   });
  // }

  createNote() {
    console.log('note created!', this.formGroup.value);
  }
}
