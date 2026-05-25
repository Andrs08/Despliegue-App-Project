import { NotFoundException } from '@nestjs/common';
import { LoteRepository } from '../../domain/repositories/lot.repository';

export class GetLoteUseCase {
  constructor(private repo: LoteRepository) {}

  async execute(id: string) {
    const lote = await this.repo.findById(id);

    if (!lote) {
      throw new NotFoundException('No se encontro el lote');
    }

    return lote;
  }
}
