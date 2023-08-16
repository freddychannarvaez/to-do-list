import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListScreenComponent } from './list-screen.component';
import { HttpClientModule } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { By } from '@angular/platform-browser';

describe('ListScreenComponent', () => {
  let component: ListScreenComponent;
  let fixture: ComponentFixture<ListScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListScreenComponent],
      providers: [{ provide: MatDialog, useValue: {}},
                  { provide: MatDialogRef, useValue: {} },
                  { provide: MAT_DIALOG_DATA, useValue: {}},
                  { provide: MatSnackBar, useValue: {}},
                  { provide: MatFormFieldControl, useValue: {}},
                ],
      imports: [
        HttpClientModule,
        MatMenuModule,
        MatIconModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
      ],

    });
    fixture = TestBed.createComponent(ListScreenComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('h1 should be All notes', () => {
    const fixture = TestBed.createComponent(ListScreenComponent);
    component = fixture.componentInstance;
    const title = fixture.debugElement.nativeElement.querySelector("h1");
    expect(title.innerHTML).toBe('');
  });

  it('form should contain input', () => {
    const fixture = TestBed.createComponent(ListScreenComponent);
    component = fixture.componentInstance;
    let inputName = fixture.debugElement.query(By.css('#create-input'));
    inputName.nativeElement.focus();
    inputName.nativeElement.value = '';
    inputName.triggerEventHandler('ngModelChange', 'content');
  });
});
