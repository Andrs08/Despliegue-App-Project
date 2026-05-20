import { AgriculturalAlert } from '../interfaces/agricultural-alert.interface';

export class TemperatureRules {
  evaluate(temperatura: number): AgriculturalAlert | null {
    if (temperatura > 34) {
      return {
        tipo: 'TEMPERATURA',
        nivel: 'ALTO',
        mensaje:
          'La temperatura es demasiado alta, el cultivo puede sufrir daños',
      };
    }

    if (temperatura > 30) {
      return {
        tipo: 'TEMPERATURA',
        nivel: 'MEDIO',
        mensaje: 'La temperatura del cultivo es alta',
      };
    }

    if (temperatura < 16) {
      return {
        tipo: 'TEMPERATURA',
        nivel: 'ALTO',
        mensaje:
          'La temperatura es demasiado baja, el cultivo puede sufrir daños',
      };
    }

    if (temperatura < 20) {
      return {
        tipo: 'TEMPERATURA',
        nivel: 'MEDIO',
        mensaje: 'La temperatura del cultivo es baja',
      };
    }
    return null;
  }
}
