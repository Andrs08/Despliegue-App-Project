import { INotesRepository } from "../domain/repositories/notes.repository.interface";

export class UpdateNoteUseCase {
  constructor(private readonly notesRepository: INotesRepository) {}

  async execute(
    id: string,
    title: string,
    description: string,
    imageUri: string | null,
  ): Promise<void> {
    await this.notesRepository.update(id, title, description, imageUri);
  }
}
