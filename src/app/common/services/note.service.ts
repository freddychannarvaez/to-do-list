import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Note } from '../models/note.model';
import { BehaviorSubject, Observable, Subscription, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  // Base url
  baseurl = 'http://localhost:3000';

  private _currentNotes$ = new BehaviorSubject<Note[]>([]);
  public readonly currentNotes$ = this._currentNotes$.asObservable();
  subscriptions: Subscription[] = [];


  constructor(private http: HttpClient) {
    this.subscriptions.push(
      this.getAllNotes().subscribe((notes) => {
        this._currentNotes$.next(notes);
      })
    );
   }

  // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }),
  };

  updateNotesSubject(notes: Note[]) {
    this._currentNotes$.next(notes);
  }

  /**
   * Gets all existing notes.
   * @returns Observable with the notes array.
   */
  getAllNotes(): Observable<Note[]> {
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

  /**
   * Gets all daily notes.
   * @returns Observable with the notes array.
   */
  getTodayNotes(): Observable<Note[]> {
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

  /**
   * Gets a note by id.
   * @param id Id of the note to find.
   * @returns Observable containing the note.
   */
  get(id: number): Observable<Note> {
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

  /**
   * Returns all notes that match the value, by content property.
   * @param value Text string to search for.
   * @returns Observable with the notes array.
   */
  search(value: string): Observable<Note[]> {
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
  
  /**
   * Creates a note.
   * @param content Content property of the note.
   * @param position Position property of the note.
   * @param isFavorite If note is marked as Daily Note.
   * @returns Observable of the created note.
   */
  create(content: string, position: number, isFavorite = false): Observable<Note> {
    const note: Note = {
      dateCreated: Date.now().valueOf(),
      title: '',
      content: content ?? '',
      isArchived: false,
      isFavorite: isFavorite ?? false,
      images: [],
      position: position
    }
    return this.http.post<Note>(`${this.baseurl}/note`, JSON.stringify(note), this.httpOptions);
  }

  /**
   * Updates a note.
   * @param id Id of the note to update.
   * @param note Note data.
   * @returns Observable of the updated note.
   */
  update(id: number, note: Note): Observable<Note> {
    return this.http.patch<Note>(`${this.baseurl}/note/${id}`, JSON.stringify({...note}), this.httpOptions);
  }

  /**
   * Deletes a note by id.
   * @param id Id of the note to delete.
   * @returns Observable of the deleted note.
   */
  delete(id: number): Observable<Note> {
    return this.http.delete<Note>(`${this.baseurl}/note/${id}`, this.httpOptions);
  }
}
