import type { LoteRepository } from "../../domain/repositories/lot.repository";
import type { Lote } from "../../domain/entities/lot.entity";

export class GetLoteUseCase {
  constructor(private readonly loteRepo: LoteRepository) {}

  async execute(id: string): Promise<Lote | null> {
    return this.loteRepo.findById(id);
  }
}
