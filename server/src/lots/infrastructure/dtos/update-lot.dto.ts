import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateLoteDTO {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsNumber()
  hectareas?: number;

  @IsOptional()
  @IsNumber()
  temperatura_min?: number;

  @IsOptional()
  @IsNumber()
  temperatura_max?: number;

  @IsOptional()
  @IsNumber()
  etapa_actual_id?: number;

  @IsOptional()
  fecha_inicio?: Date;

  @IsOptional()
  @IsNumber()
  numero_plantas?: number;
}
