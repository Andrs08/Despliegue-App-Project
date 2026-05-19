import { AgriculturalAlert } from '../interfaces/agricultural-alert.interface';

export class DistanceRules {
  evaluate(distancia_plantas: number): AgriculturalAlert | null {
    const limite = 2;
    const distancia_min = 2.4;
    const distancia_max = 2.8;

    if (distancia_plantas < limite) {
      return {
        tipo: 'DISTANCIA',
        nivel: 'ALTO',
        mensaje: `Hay muy poca distancia entre las plantas. La distancia minima recomendada es ${distancia_min} metros`,
      };
    }
    if (distancia_plantas < distancia_min) {
      return {
        tipo: 'DISTANCIA',
        nivel: 'MEDIO',
        mensaje: `Hay muy poca distancia entre las plantas. La distancia minima recomendada es de ${distancia_min} metros`,
      };
    }
    if (distancia_plantas < distancia_min) {
      return {
        tipo: 'DISTANCIA',
        nivel: 'BAJO',
        mensaje: `Hay mucha distancia entre las plantas. La distancia maxima recomendada es de ${distancia_max} metros`,
      };
    }

    return null;
  }
}
