import type {
  LoteRepository,
  FilterLotesInput,
} from "../../domain/repositories/lot.repository";
import type { Lote } from "../../domain/entities/lot.entity";

export class FilterLotesUseCase {
  constructor(private readonly loteRepo: LoteRepository) {}

  async execute(filters: FilterLotesInput): Promise<Lote[]> {
    return this.loteRepo.findWithFilters(filters);
  }
}
