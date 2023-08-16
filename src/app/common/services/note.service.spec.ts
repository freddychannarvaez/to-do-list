import { TestBed } from '@angular/core/testing';

import { NoteService } from './note.service';
import { HttpClientModule } from '@angular/common/http';

const dummyGetAllNotesResponse = [
    { id: 1, title: 'Title1', content: 'content 1', dateCreated: '0', isArchived: false, isFavorite: false, images: [], position: 0 },
    { id: 2, title: 'Title2', content: 'content 2', dateCreated: '0', isArchived: false, isFavorite: false, images: [], position: 1 },
    { id: 3, title: 'Title3', content: 'content 3', dateCreated: '0', isArchived: false, isFavorite: false, images: [], position: 2 },
  ];

describe('NoteService', () => {
  let service: NoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    service = TestBed.inject(NoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAllNotes() should return data', () => {
    service.getAllNotes().subscribe((res) => {
      expect(res).toEqual(dummyGetAllNotesResponse);
    })
  });

});
