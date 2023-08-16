import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './common/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListScreenComponent } from './components/list-screen/list-screen.component';
import { By } from '@angular/platform-browser';

let component: AppComponent;

describe('AppComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      RouterTestingModule,
      HttpClientModule,
      MaterialModule,
      BrowserAnimationsModule,
      FormsModule,
      ReactiveFormsModule,
    ],
    declarations: [
      AppComponent,
      ListScreenComponent,
    ]
  })
  );

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('toggle button should be clickable', () => {
    const fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    const btn = fixture.debugElement.nativeElement.querySelector("#toggleButton");
    btn.click();
  });

  it('form should contain input', () => {
    const fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    let inputName = fixture.debugElement.query(By.css('#search-input'));
    inputName.nativeElement.focus();
    inputName.nativeElement.value = '';
    inputName.triggerEventHandler('ngModelChange', 'content');
  });
});
