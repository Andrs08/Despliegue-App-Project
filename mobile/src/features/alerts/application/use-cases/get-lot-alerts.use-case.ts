import { Alert } from "../../domain/entities/alert.entity";
import { AlertRepository } from "../../domain/repositories/alert.repository";

export class GetLotAlertsUseCase {
  constructor(private readonly alertRepository: AlertRepository) {}

  async execute(loteId: string): Promise<Alert[]> {
    return this.alertRepository.findByLote(loteId);
  }
}
