export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export type CreateNoteDto = Omit<Note, 'id' | 'createdAt'>;
