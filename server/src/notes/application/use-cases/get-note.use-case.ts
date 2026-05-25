import { INoteRepository } from '../../domain/repositories/note.repository.interface';

export class GetNoteUseCase {
  constructor(private noteRepository: INoteRepository) {}

  async execute(id: string) {
    return this.noteRepository.findById(id);
  }
}
