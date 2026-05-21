import type {
  LoteRepository,
  UpdateLoteInput,
} from "../../domain/repositories/lot.repository";
import type { Lote } from "../../domain/entities/lot.entity";

export class UpdateLoteUseCase {
  constructor(private readonly loteRepo: LoteRepository) {}

  async execute(id: string, input: UpdateLoteInput): Promise<Lote> {
    return this.loteRepo.update(id, input);
  }
}
