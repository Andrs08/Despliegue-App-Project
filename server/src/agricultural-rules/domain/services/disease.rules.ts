import { AgriculturalAlert } from '../interfaces/agricultural-alert.interface';

export class DiseaseRules {
  evaluate(plantasEnfermas: number, totalPlantas: number): AgriculturalAlert {
    const porcentaje = (plantasEnfermas / totalPlantas) * 100;

    if (porcentaje <= 5) {
      return {
        tipo: 'ENFERMEDAD',
        nivel: 'BAJO',
        mensaje: 'La enfermedad está controlada',
      };
    }

    if (porcentaje <= 15) {
      return {
        tipo: 'ENFERMEDAD',
        nivel: 'MEDIO',
        mensaje: 'Peligro por enfermedad.',
      };
    }

    return {
      tipo: 'ENFERMEDAD',
      nivel: 'ALTO',
      mensaje: 'Estado de salud grave, se necesita acción inmediata',
    };
  }
}
