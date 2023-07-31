import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';

@NgModule({
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  imports:[MaterialModule,FormsModule,ReactiveFormsModule,CommonModule],
  declarations: [],
  providers: [],
})
export class BasicModule {}