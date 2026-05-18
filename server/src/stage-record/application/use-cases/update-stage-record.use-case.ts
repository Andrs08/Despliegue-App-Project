import { InternalServerErrorException } from '@nestjs/common';

export class UpdateStageRecordUseCase {
  constructor(private repository: any) {}

  async execute(id: string, data: any) {
    const updated = this.repository.update(id, data);

    if (!updated)
      throw new InternalServerErrorException('Error actualizando el registro');
    return updated;
  }
}
