import { Note } from '../entities/note.entity';

export interface INoteRepository {
  save(note: Note): Promise<Note>;
  update(id: string, note: Partial<Note>): Promise<Note>;
  findAllByUser(userId: string): Promise<Note[]>;
  findById(id: string): Promise<Note>;
  delete(id: string);
}
