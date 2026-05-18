import { AgriculturalAlert } from '../interfaces/agricultural-alert.interface';

export class HarvestRules {
  evaluate(kgCosechados: number, hectareas: number): AgriculturalAlert | null {
    const rendimiento = kgCosechados / hectareas;

    if (rendimiento < 25000) {
      return {
        tipo: 'COSECHA',
        nivel: 'MEDIO',
        mensaje: 'La productividad del lote fue baja',
      };
    }

    return null;
  }
}
