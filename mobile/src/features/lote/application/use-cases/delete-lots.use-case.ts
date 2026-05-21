import type { LoteRepository } from "../../domain/repositories/lot.repository";

export class DeleteLoteUseCase {
  constructor(private readonly loteRepo: LoteRepository) {}

  async execute(id: string): Promise<void> {
    return this.loteRepo.delete(id);
  }
}
