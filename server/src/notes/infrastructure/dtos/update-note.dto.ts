import {
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsString,
  IsDate,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class UpdateNoteDto {
  @IsOptional()
  @IsUUID()
  lote_id?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  titulo?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  imagen_url?: string;

  @Type(() => Date)
  @IsOptional()
  @IsDate({ message: 'La fecha debe ser una fecha válida' })
  fecha?: Date;

  @IsUUID()
  usuario_id?: string;
}
