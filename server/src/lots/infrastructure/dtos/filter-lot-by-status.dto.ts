import { IsOptional, IsString } from 'class-validator';

export class FilterLotsDTO {
  @IsOptional()
  @IsString()
  estado?: string;

  @IsOptional()
  @IsString()
  nombre?: string;
}
