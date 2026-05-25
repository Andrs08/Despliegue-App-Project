import type { AlertRepository } from "../../domain/repositories/alert.repository";
import type { LoteAlert } from "../../domain/entities/alert.entity";

export class GetLoteAlertsUseCase {
  constructor(private readonly alertRepo: AlertRepository) {}

  async execute(loteId: string): Promise<LoteAlert[]> {
    return this.alertRepo.findByLoteId(loteId, 3);
  }
}
