import { AgriculturalAlert } from '../interfaces/agricultural-alert.interface';

export class StageRules {
  evaluate(
    fechaInicio: Date,
    etapa_actuaL_id: number,
  ): AgriculturalAlert | null {
    const hoy = new Date();

    const dias = Math.floor(
      (hoy.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (etapa_actuaL_id === 2 && dias > 60) {
      return {
        tipo: 'ETAPA',
        nivel: 'BAJO',
        mensaje:
          'Es posible que el lote este listo para avanzar a la fase de desarrollo vegetativo',
      };
    }

    if (etapa_actuaL_id === 3 && dias > 120) {
      return {
        tipo: 'ETAPA',
        nivel: 'BAJO',
        mensaje:
          'Es posible que el lote este listo para avanzar a la fase de floracion',
      };
    }

    if (etapa_actuaL_id === 4 && dias > 90) {
      return {
        tipo: 'ETAPA',
        nivel: 'BAJO',
        mensaje:
          'Es posible que el lote este listo para avanzar a la fase de fructificacion',
      };
    }

    if (etapa_actuaL_id === 5 && dias > 90) {
      return {
        tipo: 'ETAPA',
        nivel: 'BAJO',
        mensaje:
          'Es posible que el lote este listo para avanzar a la fase de cosecha',
      };
    }

    return null;
  }
}
