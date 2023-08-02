import { Note } from "./note.model";

export interface List {
  dateCreated: number;
  isArchived: boolean;
  title: string;
  notes: Note[];
  position: number;
}