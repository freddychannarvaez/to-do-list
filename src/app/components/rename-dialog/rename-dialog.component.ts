import { Component, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ListService } from 'src/app/common/services/list.service';

@Component({
  selector: 'app-rename-dialog',
  templateUrl: './rename-dialog.component.html',
  styleUrls: ['./rename-dialog.component.scss']
})
export class RenameDialogComponent {
    title!: string;
    id!: number;

    constructor(private dialogRef: MatDialogRef<RenameDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private listService: ListService) {

    }

    ngOnInit(): void {
      //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
      //Add 'implements OnInit' to the class.
      console.log(this.data);
      this.title = this.data.title;
      this.id = this.data.id;
    }

    renameList(form: NgForm) {
      if (this.title !== this.data.title) {
        this.listService.update(this.id, {...this.data, title: this.title})
          .subscribe((x) => {
            console.log(x);
          })
      }
      form.reset();
      this.dialogRef.close();
    }

}
