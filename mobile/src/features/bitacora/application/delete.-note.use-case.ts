import { INotesRepository } from "../domain/repositories/notes.repository.interface";

export class DeleteNotesUseCase {
  constructor(private readonly notesRepository: INotesRepository) {}

  async execute(id: string): Promise<void> {
    await this.notesRepository.delete(id);
  }
}
