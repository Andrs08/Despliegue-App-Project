import { NotFoundException } from '@nestjs/common';
import { LoteRepository } from 'src/lots/domain/repositories/lot.repository';

export class DeleteLoteUseCase {
  constructor(private repo: LoteRepository) {}

  async execute(id: string): Promise<void> {
    const lote = await this.repo.findById(id);

    if (!lote) {
      throw new NotFoundException('Lote no existe');
    }

    await this.repo.delete(id);
  }
}
