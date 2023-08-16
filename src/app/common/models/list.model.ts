export interface List {
  id?: number;
  dateCreated: number | string;
  title: string;
  isArchived: boolean;
  isFavorite: boolean;
  notes: number[];
  position: number;
}