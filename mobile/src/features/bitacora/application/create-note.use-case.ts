import { INotesRepository } from "../domain/repositories/notes.repository.interface";

export class CreateNoteUseCase {
  constructor(private readonly notesRepository: INotesRepository) {}

  async execute(
    title: string,
    description: string,
    lotId: string | null,
    imageUri: string | null,
  ): Promise<void> {
    await this.notesRepository.create(title, description, lotId, imageUri);
  }
}
