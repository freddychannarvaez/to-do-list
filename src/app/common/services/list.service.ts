import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { List } from '../models/list.model';
import { Observable, map } from 'rxjs';
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

  /**
   * Gets all existing lists.
   * @returns Observable with the lists array.
   */
  getAllLists(): Observable<List[]> {
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

  /**
   * Gets a list by id.
   * @param id Id of the list to find.
   * @returns Observable containing the list.
   */
  get(id: number): Observable<List> {
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

  /**
   * Gets all notes included in a list.
   * @param id Id of the list
   * @returns Observable of the notes array.
   */
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

  /**
   * Creates a list.
   * @param title Title of the list.
   * @param position Position of the list.
   * @param notes Notes included in the list.
   * @param isFavorite If list is marked as favorite.
   * @returns Observable of the created list.
   */
  create(title: string, position: number, notes: number[], isFavorite = false): Observable<List> {
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

  /**
   * Updates a list.
   * @param id Id of the list to update.
   * @param list List data.
   * @returns Observable of the updated list.
   */
  update(id: number, list: List): Observable<any> {
    return this.http.patch<List>(`${this.baseurl}/list/${id}`, JSON.stringify({...list}), this.httpOptions);
  }

  /**
   * Deletes a list by id.
   * @param id Id of the list to delete.
   * @param notesIds Array containing the ids of the notes included in the list.
   * @returns Observable of the deleted list.
   */
  delete(id: number, notesIds: number[]): Observable<List> {
    // Delete also the notes included in the list
    this.deleteNotesFromList(notesIds);
    return this.http.delete<List>(`${this.baseurl}/list/${id}`, this.httpOptions);
  }

  private deleteNotesFromList(notesIds: number[]): void {
    for (const noteId of notesIds) {
      this.http.delete<Note>(`${this.baseurl}/note/${noteId}`, this.httpOptions);
    }
  }
}
