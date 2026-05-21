import type { LoteAlert } from "../entities/alert.entity";

export abstract class AlertRepository {
  abstract findByLoteId(loteId: string, limit?: number): Promise<LoteAlert[]>;
}
