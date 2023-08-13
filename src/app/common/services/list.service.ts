import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { List } from '../models/list.model';
import { map } from 'rxjs';
import { Note } from '../models/note.model';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  // Base url
  baseurl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }),
  };

  getAllLists() {
    return this.http.get<List[]>(`${this.baseurl}/list`, this.httpOptions)
    .pipe(map((lists) => {
      return lists.map((list: List) => {
        return {
          id: list.id ?? -1,
          dateCreated: list.dateCreated ?? 0,
          title: list.title ?? 'Not available',
          isArchived: list.isArchived ?? false,
          isFavorite: list.isFavorite ?? false,
          position: list.position ?? 0,
          notes: list.notes ?? []
        }
      }).sort((x, y) => x.position - y.position);
    }));
  }

  // getTodayNotes() {
  //   return this.http.get<Note[]>(`${this.baseurl}/note/favorites`, this.httpOptions)
  //   .pipe(map((notes) => {
  //     return notes.map((note: Note) => {
  //       return {
  //         id: note.id ?? -1,
  //         dateCreated: note.dateCreated ?? 0,
  //         title: note.title ?? 'Not available',
  //         content: note.content ?? 'Not available',
  //         isArchived: note.isArchived ?? false,
  //         isFavorite: note.isFavorite ?? false,
  //         images: note.images ?? [],
  //         position: note.position ?? 0
  //       }
  //     }).sort((x, y) => x.position - y.position);
  //   }));
  // }

  get(id: number) {
    return this.http.get<List>(`${this.baseurl}/list/${id}`, this.httpOptions)
    .pipe(map((list) => {
      return {
        id: list.id ?? -1,
        dateCreated: list.dateCreated ?? 0,
        title: list.title ?? 'Not available',
        isArchived: list.isArchived ?? false,
        isFavorite: list.isFavorite ?? false,
        position: list.position ?? 0,
        notes: list.notes ?? [],
      }
    }));
  }

  getNotesFromList(id: number) {
    return this.http.get<Note[]>(`${this.baseurl}/list/favorites`, this.httpOptions)
      .pipe(map((notes) => {
        return notes.map((note: Note) => {
          return {
            id: note.id ?? -1,
            dateCreated: note.dateCreated ?? 0,
            title: note.title ?? 'Not available',
            content: note.content ?? 'Not available',
            isArchived: note.isArchived ?? false,
            isFavorite: note.isFavorite ?? false,
            images: note.images ?? [],
            position: note.position ?? 0
          }
        }).sort((x, y) => x.position - y.position);
      }));
  }

  search(value: string) {
    console.log("🚀 ~ file: list.service.ts:74 ~ ListService ~ search ~ value:", value)
    return this.http.get<List[]>(`${this.baseurl}/list/search/${value}`, this.httpOptions)
    .pipe(map((lists) => {
      return lists.map((list: List) => {
        return {
          id: list.id ?? -1,
          dateCreated: list.dateCreated ?? 0,
          title: list.title ?? 'Not available',
          isArchived: list.isArchived ?? false,
          isFavorite: list.isFavorite ?? false,
          position: list.position ?? 0,
          notes: list.notes ?? [],
        }
      });
    }));
  }

  create(title: string, position: number, notes: number[], isFavorite = false) {
    const list: List = {
      dateCreated: Date.now().valueOf(),
      title: title,
      isArchived: false,
      isFavorite: isFavorite ?? false,
      position: position,
      notes: notes ?? [],
    }
    return this.http.post<List>(`${this.baseurl}/list`, JSON.stringify(list), this.httpOptions);
  }

  update(id: number, list: List) {
    console.log("🚀 ~ file: list.service.ts:123 ~ ListService ~ update ~ id:", id)
    console.log('updating list', list);
    return this.http.patch<List>(`${this.baseurl}/list/${id}`, JSON.stringify({...list}), this.httpOptions);
  }

  delete(id: number) {
    return this.http.delete<List>(`${this.baseurl}/list/${id}`, this.httpOptions);
  }
}
