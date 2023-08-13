import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { BasicModule } from './common/basic.module';
import { ListScreenComponent } from './components/list-screen/list-screen.component';
import { NoteBlockComponent } from './components/note-block/note-block.component';
import { RenameDialogComponent } from './components/rename-dialog/rename-dialog.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    ListScreenComponent,
    NoteBlockComponent,
    RenameDialogComponent,
    ConfirmDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    BasicModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
