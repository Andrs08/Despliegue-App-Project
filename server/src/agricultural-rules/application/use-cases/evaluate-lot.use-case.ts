import { AgriculturalAlert } from 'src/agricultural-rules/domain/interfaces/agricultural-alert.interface';

export class EvaluateLotUseCase {
  constructor(
    private temperatureRules: any,
    private densityRules: any,
    private stageRules: any,
  ) {}

  async execute(lote: any) {
    const alerts: AgriculturalAlert[] = [];

    const temperaturaPromedio =
      (lote.temperatura_min + lote.temperatura_max) / 2;
      
    const temperatura = this.temperatureRules.evaluate(temperaturaPromedio);

    if (temperatura) {
      alerts.push(temperatura);
    }

    const densidad = this.densityRules.evaluate(
      lote.hectareas,
      lote.numero_plantas,
    );

    if (densidad) {
      alerts.push(densidad);
    }

    const etapa = this.stageRules.evaluate(lote.fecha_inicio, lote.etapa_actual_id);

    if (etapa) {
      alerts.push(etapa);
    }

    return alerts;
  }
}
