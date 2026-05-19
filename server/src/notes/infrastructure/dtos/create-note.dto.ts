import {
  IsString,
  IsOptional,
  IsUUID,
  IsNotEmpty,
  IsDate,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateNoteDto {
  @IsUUID()
  @IsOptional()
  lote_id?: string;

  @IsString()
  @IsNotEmpty({ message: 'El título no puede estar vacío' })
  @Transform(({ value }) => value.trim())
  titulo!: string;

  @IsString()
  @IsNotEmpty({ message: 'La descripción no puede estar vacía' })
  description!: string;

  @IsOptional()
  @IsString()
  imagen_url?: string;

  @Type(() => Date)
  @IsDate({ message: 'La fecha debe ser una fecha válida' })
  fecha!: Date;
}
