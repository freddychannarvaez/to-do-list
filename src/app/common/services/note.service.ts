import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Note } from '../models/note.model';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
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

  getAllNotes() {
    return this.http.get<Note[]>(`${this.baseurl}/note`, this.httpOptions)
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

  getTodayNotes() {
    return this.http.get<Note[]>(`${this.baseurl}/note/favorites`, this.httpOptions)
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

  get(id: number) {
    return this.http.get<Note>(`${this.baseurl}/note/${id}`, this.httpOptions)
    .pipe(map((note) => {
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
    }));
  }

  search(value: string) {
    console.log("🚀 ~ file: note.service.ts:58 ~ NoteService ~ search ~ value:", value)
    return this.http.get<Note[]>(`${this.baseurl}/note/search/${value}`, this.httpOptions)
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
      });
    }));
  }
  
  create(content: string, position: number, isFavorite = false) {
    const note: Note = {
      dateCreated: Date.now().valueOf(),
      title: '',
      content: content ?? '',
      isArchived: false,
      isFavorite: isFavorite ?? false,
      images: [],
      position: position
    }
    console.log("🚀 ~ file: note.service.ts:104 ~ NoteService ~ create ~ note:", note);
    // return note;
    return this.http.post<Note>(`${this.baseurl}/note`, JSON.stringify(note), this.httpOptions);
  }
}
