import { Injectable } from '@nestjs/common';
import { LoteRepository } from '../../domain/repositories/lot.repository';
import { FilterLotsDTO } from 'src/lots/infrastructure/dtos/filter-lot-by-status.dto';
import { Lot } from '../../domain/entities/lot.entity';

@Injectable()
export class FilterLotsUseCase {
  constructor(private loteRepo: LoteRepository) {}

  async execute(userId: string, filters: FilterLotsDTO): Promise<Lot[]> {
    return this.loteRepo.findWithFilters(userId, filters);
  }
}
