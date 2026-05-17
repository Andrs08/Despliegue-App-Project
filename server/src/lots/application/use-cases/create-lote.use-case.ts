import { LoteRepository } from '../../domain/repositories/lot.repository';
import { Lot } from '../../domain/entities/lot.entity';
import { v4 as uuid } from 'uuid';
import { CreateLoteDTO } from '../../infrastructure/dtos/create-lote.dto';
import { EvaluateLotUseCase } from 'src/agricultural-rules/application/use-cases/evaluate-lot.use-case';
import { CreateAlertUseCase } from 'src/alert/application/use-cases/create-alert.use-case';

export class CreateLoteUseCase {
  constructor(
    private loteRepo: LoteRepository,
    private evaluateLote: EvaluateLotUseCase,
    private createAlert: CreateAlertUseCase,
  ) {}

  async execute(data: CreateLoteDTO, userId: string) {
    const lote = new Lot(
      uuid(),
      userId,
      data.nombre,
      data.hectareas,
      data.temperatura_min,
      data.temperatura_max,
      data.etapa_actual_id,
      new Date(data.fecha_inicio),
      data.numero_plantas,
    );

    const savedLot = await this.loteRepo.create(lote);
    const alerts = await this.evaluateLote.execute(lote);

    if (alerts.length > 0) {
      for (const alert of alerts) {
        await this.createAlert.execute({
          loteId: lote.id,
          tipo: alert.tipo,
          nivel: alert.nivel,
          mensaje: alert.mensaje
        });
      }
    }

    return {
      lote: savedLot,
      alertas: alerts || null,
    };
  }
}
