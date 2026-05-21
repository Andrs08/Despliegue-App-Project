import type { LoteRepository } from "../../domain/repositories/lot.repository";
import type { Lote } from "../../domain/entities/lot.entity";

export class GetLotesUseCase {
  constructor(private readonly loteRepo: LoteRepository) {}

  async execute(): Promise<Lote[]> {
    return this.loteRepo.findAllByUser();
  }
}
