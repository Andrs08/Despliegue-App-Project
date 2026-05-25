import { IsDate, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateStageRecordDTO {

  @IsNotEmpty()
  lote_id!: string;

  @IsNotEmpty()
  etapa_id!: number;

  @IsNotEmpty({message: 'Debe ingresar los campos'})
  datos!: Record<string, any>;

  @Type(() => Date)
  @IsDate({ message: 'La fecha debe ser una fecha válida' })
  fecha!: Date;
}
