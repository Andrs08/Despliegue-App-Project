import { Alert } from "../../domain/entities/alert.entity";
import { AlertRepository } from "../../domain/repositories/alert.repository";

export class GetAlertsUseCase {
  constructor(private readonly alertRepository: AlertRepository) {}

  async execute(): Promise<Alert[]> {
    return this.alertRepository.findAll();
  }
}
