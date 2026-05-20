import { NotFoundException } from '@nestjs/common';
import { LoteRepository } from '../../domain/repositories/lot.repository';

export class GetLotesUseCase {
  constructor(private loteRepo: LoteRepository) {}

  async execute(userId: string) {
    const lotes = this.loteRepo.findAllByUser(userId);
    
    if (!lotes) throw new NotFoundException('No se encontraron lotes')
    return lotes;
  }
}
