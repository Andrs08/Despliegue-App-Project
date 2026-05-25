import { AgriculturalAlert } from 'src/agricultural-rules/domain/interfaces/agricultural-alert.interface';

export class EvaluateStageRecordUseCase {
  constructor(
    private irrigationRules: any,
    private distanceRules: any,
    private fertilizerRules: any,
    private diseaseRules: any,
    private harvestRules: any,
  ) {}

  async execute(etapa_actuaL_id: number, datos: any) {
    const alertas: AgriculturalAlert[] = [];
    switch (etapa_actuaL_id) {
      case 1: {
        const fertilizer = this.fertilizerRules.evaluate(
          datos.plantas_totales,
          datos.fertilizante_aplicado,
        );
        if (fertilizer) {
          alertas.push(fertilizer);
        }
      }
      case 2: {
        const irrigation = this.irrigationRules.evaluate(
          datos.frecuencia_riego_mensual,
        );
        if (irrigation) {
          alertas.push(irrigation);
        }
        const distance = this.distanceRules.evaluate(datos.distancia_plantas);
        if (distance) {
          alertas.push(distance);
        }
        return alertas;
      }

      case 3: {
        const irrigation = this.irrigationRules.evaluate(
          datos.frecuencia_riego_mensual,
        );
        if (irrigation) {
          alertas.push(irrigation);
        }
        const disease = this.diseaseRules.evaluate(
          datos.plantas_enfermas,
          datos.plantas_totales,
        );
        if (disease) {
          alertas.push(disease);
        }
        return alertas;
      }

      case 4: {
        const irrigation = this.irrigationRules.evaluate(
          datos.frecuencia_riego_mensual,
        );
        if (irrigation) {
          alertas.push(irrigation);
        }
        return alertas;
      }

      case 5: {
        const irrigation = this.irrigationRules.evaluate(
          datos.frecuencia_riego_mensual,
        );
        if (irrigation) {
          alertas.push(irrigation);
        }
        return alertas;
      }

      case 6: {
        const irrigation = this.irrigationRules.evaluate(
          datos.frecuencia_riego_mensual,
        );
        if (irrigation) {
          alertas.push(irrigation);
        }
        const harvest = this.harvestRules.evaluate(
          datos.kg_cosechados,
          datos.hectareas,
        );
        if (harvest) {
          alertas.push(harvest);
        }
        return alertas;
      }

      default:
        return alertas;
    }
  }
}
