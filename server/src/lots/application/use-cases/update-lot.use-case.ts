import { InternalServerErrorException } from '@nestjs/common';
import { LoteRepository } from '../../domain/repositories/lot.repository';
import { UpdateLoteDTO } from 'src/lots/infrastructure/dtos/update-lot.dto';

export class UpdateLoteUseCase {
  constructor(private loteRepo: LoteRepository) {}

  async execute(id: string, data: UpdateLoteDTO) {
    const update = this.loteRepo.update(id, data);

    if (!update)
      throw new InternalServerErrorException('Error actualizando el lote');
    return update;
  }
}
