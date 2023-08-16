import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteBlockComponent } from './note-block.component';
import { HttpClientModule } from '@angular/common/http';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';

describe('NoteBlockComponent', () => {
  let component: NoteBlockComponent;
  let fixture: ComponentFixture<NoteBlockComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        MatCheckboxModule,
        MatSlideToggleModule,
        MatTooltipModule,
      ],
      declarations: [NoteBlockComponent]
    });
    fixture = TestBed.createComponent(NoteBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
