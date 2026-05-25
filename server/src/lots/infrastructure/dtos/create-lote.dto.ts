import { IsDate, IsNumber, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLoteDTO {
  @IsNotEmpty({ message: 'Debe ingresar un nombre' })
  nombre!: string;
  @IsNotEmpty({ message: 'Debe ingresar las hectareas de su lote' })
  @IsNumber()
  hectareas!: number;
  @IsNotEmpty()
  @IsNumber()
  temperatura_min!: number;
  @IsNotEmpty()
  @IsNumber()
  temperatura_max!: number;
  @IsNotEmpty()
  @IsNumber()
  etapa_actual_id!: number;
  @Type(() => Date)
  @IsDate({ message: 'La fecha debe ser una fecha válida' })
  fecha_inicio!: Date;
  @IsNotEmpty({ message: 'Debe ingresar el numero de plantas' })
  @IsNumber()
  numero_plantas!: number;
}
