
export interface Note {
  id?: number;
  dateCreated: number | string;
  title: string;
  content: string;
  isArchived: boolean;
  isFavorite: boolean;
  images: any[];
  position: number;
}