import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteBlockComponent } from './note-block.component';

describe('NoteBlockComponent', () => {
  let component: NoteBlockComponent;
  let fixture: ComponentFixture<NoteBlockComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
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
