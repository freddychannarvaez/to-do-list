import { TestBed } from '@angular/core/testing';

import { ListService } from './list.service';
import { HttpClientModule } from '@angular/common/http';

const dummyGetAllListsResponse = [
  { id: 1, title: 'Title1', dateCreated: '0', isArchived: false, isFavorite: false, notes: [], position: 0 },
  // { id: 2, title: 'Title2', dateCreated: '0', isArchived: false, isFavorite: false, notes: [], position: 1 },
  // { id: 3, title: 'Title3', dateCreated: '0', isArchived: false, isFavorite: false, notes: [], position: 2 },
];

describe('ListService', () => {
  let service: ListService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    service = TestBed.inject(ListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAllLists() should return data', () => {
    service.getAllLists().subscribe((res) => {
      expect(res).toEqual(dummyGetAllListsResponse);
    })
  });
});
