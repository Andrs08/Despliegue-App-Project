import { AgriculturalAlert } from '../interfaces/agricultural-alert.interface';

export class IrrigationRules {
  evaluate(frecuenciaRiego: number): AgriculturalAlert | null {
    if (frecuenciaRiego < 10) {
      return {
        tipo: 'RIEGO',
        nivel: 'MEDIO',
        mensaje: 'Debe aumentar la frecuencia de riego',
      };
    }

    return null;
  }
}
