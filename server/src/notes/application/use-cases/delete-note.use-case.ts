import { INoteRepository } from '../../domain/repositories/note.repository.interface';

export class DeleteNoteUseCase {
  constructor(private noteRepository: INoteRepository) {}

  async execute(id: string) {
    return this.noteRepository.delete(id);
  }
}
