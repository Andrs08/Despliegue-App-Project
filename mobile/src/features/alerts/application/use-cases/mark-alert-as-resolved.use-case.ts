import { Alert } from "../../domain/entities/alert.entity";
import { AlertRepository } from "../../domain/repositories/alert.repository";

export class MarkAlertAsResolvedUseCase {
  constructor(private readonly alertRepository: AlertRepository) {}

  async execute(id: string): Promise<Alert> {
    return this.alertRepository.markAsResolved(id);
  }
}
