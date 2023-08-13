export interface List {
  id?: number;
  dateCreated: number;
  title: string;
  isArchived: boolean;
  isFavorite: boolean;
  notes: number[];
  position: number;
}