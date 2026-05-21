import { Lot } from "../../domain/entities/lot.entity";
import { LotRepository } from "../../domain/repositories/lot.repository";

export class GetFilteredLotsUseCase {
  constructor(private readonly lotRepository: LotRepository) {}

  async execute(nombre?: string): Promise<Lot[]> {
    return this.lotRepository.findByName(nombre);
  }
}
