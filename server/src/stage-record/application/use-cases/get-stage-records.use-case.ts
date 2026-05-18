import { NotFoundException } from '@nestjs/common';

export class GetStageRecordsUseCase {
  constructor(private repository: any) {}

  async execute(loteId: string) {
    const registro = this.repository.findByLote(loteId);
    if (!registro) throw new NotFoundException('No se encontro el registro');
    return registro;
  }
}
