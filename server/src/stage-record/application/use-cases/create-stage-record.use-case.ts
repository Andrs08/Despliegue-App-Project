import { v4 as uuid } from 'uuid';
import { StageRecord } from '../../domain/entities/stage-record.entity';
import { CreateAlertUseCase } from 'src/alert/application/use-cases/create-alert.use-case';
import { EvaluateStageRecordUseCase } from 'src/agricultural-rules/application/use-cases/evaluate-stage-record.use-case';

export class CreateStageRecordUseCase {
  constructor(
    private repository: any,
    private evaluateStageRecord: EvaluateStageRecordUseCase,
    private createAlert: CreateAlertUseCase,
  ) {}

  async execute(data: any) {
    const record = new StageRecord(
      uuid(),
      data.lote_id,
      data.etapa_id,
      data.datos,
      data.fecha,
    );

    const savedRecord = await this.repository.create(record);
    if (!savedRecord) throw new Error('Error en la creacion del registro');
    const alerts = await this.evaluateStageRecord.execute(
      data.etapa_id,
      data.datos,
    );
    if (!alerts) throw new Error('Error en la creacion de las alertas');

    if (alerts.length) {
      for (const alert of alerts) {
        await this.createAlert.execute({
          loteId: data.lote_id,
          tipo: alert.tipo,
          nivel: alert.nivel,
          mensaje: alert.mensaje,
        });
      }
    }

    return {
      registro: savedRecord,

      alerta: alerts || null,
    };
  }
}
