import { BitacoraRouteItem } from "@/src/core/navigation/app_navigator";
import { INotesRepository } from "../domain/repositories/notes.repository.interface";

export class GetNotesUseCase {
  constructor(private readonly notesRepository: INotesRepository) {}

  async execute(): Promise<BitacoraRouteItem[]> {
    return await this.notesRepository.findAllByUser();
  }
}
