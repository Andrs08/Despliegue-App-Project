import { v4 as uuid } from 'uuid';
import { Alert } from '../../domain/entities/alert.entity';

export class CreateAlertUseCase {
  constructor(private repository: any) {}

  async execute(data: any) {
    const alert = new Alert(
      uuid(),
      data.loteId,
      data.tipo,
      data.nivel,
      data.mensaje,
    );

    return this.repository.create(alert);
  }
}
