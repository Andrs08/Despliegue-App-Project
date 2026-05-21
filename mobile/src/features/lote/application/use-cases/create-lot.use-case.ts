import type {
  LoteRepository,
  CreateLoteInput,
} from "../../domain/repositories/lot.repository";
import type { Lote } from "../../domain/entities/lot.entity";

export class CreateLoteUseCase {
  constructor(private readonly loteRepo: LoteRepository) {}

  async execute(input: CreateLoteInput): Promise<Lote> {
    return this.loteRepo.create(input);
  }
}
