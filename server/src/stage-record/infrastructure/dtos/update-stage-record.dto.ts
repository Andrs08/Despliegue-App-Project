import {IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateStageRecordDTO {
  
  @IsOptional()
  datos?: Record<string, any>;
  
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'La fecha debe ser una fecha válida' })
  fecha?: Date;
}
