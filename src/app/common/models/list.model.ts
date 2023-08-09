import { Note } from "./note.model";

export interface List {
  id: number;
  dateCreated: number;
  title: string;
  isArchived: boolean;
  isFavorite: boolean;
  notes: Note[];
  position: number;
}