import { INoteRepository } from '../../domain/repositories/note.repository.interface';

export class GetNotesUseCase {
  constructor(private noteRepository: INoteRepository) {}

  async execute(userId: string) {
    return this.noteRepository.findAllByUser(userId);
  }
}
