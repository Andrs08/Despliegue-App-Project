import { AgriculturalAlert } from '../interfaces/agricultural-alert.interface';

export class FertilizerRules {
  evaluate(
    totalPlantas: number,
    fertilizanteAplicado: number,
  ): AgriculturalAlert | null {
    const limite = totalPlantas * 0.1;
    const cantidad_min = totalPlantas * 0.2;
    const cantidad_max = totalPlantas * 0.3;

    if (fertilizanteAplicado < limite) {
      return {
        tipo: 'FERTILIZANTE',
        nivel: 'ALTO',
        mensaje:
          'Su cultivo se encuentra expuesto a problemas de crecimiento, por favor aplique mas fertilizante',
      };
    }
    if (fertilizanteAplicado < cantidad_min) {
      return {
        tipo: 'FERTILIZANTE',
        nivel: 'MEDIO',
        mensaje:
          'Su cultivo se encuentra expuesto a problemas de nutricion, por favor aplique mas fertilizante',
      };
    }
    if (fertilizanteAplicado > cantidad_max) {
      return {
        tipo: 'FERTILIZANTE',
        nivel: 'BAJO',
        mensaje: 'Esta aplicando mas fertilizante del necesario',
      };
    }
    return null;
  }
}
