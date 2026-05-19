import { AgriculturalAlert } from '../interfaces/agricultural-alert.interface';

export class DensityRules {
  evaluate(hectareas: number, plantas: number): AgriculturalAlert | null {
    const densidad = plantas / hectareas;

    if (densidad < 1600) {
      return {
        tipo: 'DENSIDAD',
        nivel: 'MEDIO',
        mensaje: 'Hay muy pocas plantas por hectárea',
      };
    }

    if (densidad > 1800) {
      return {
        tipo: 'DENSIDAD',
        nivel: 'MEDIO',
        mensaje: 'Hay muchas plantas por hectárea',
      };
    }

    return null;
  }
}
