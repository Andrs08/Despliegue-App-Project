import type { Lote, EstadoLote } from "../entities/lot.entity";

export type CreateLoteInput = {
  nombre: string;
  hectareas: number;
  temperatura_min: number;
  temperatura_max: number;
  etapa_actual_id: number;
  fecha_inicio: string;
  numero_plantas: number;
};

export type UpdateLoteInput = {
  nombre?: string;
  hectareas?: number;
  temperatura_min?: number;
  temperatura_max?: number;
  numero_plantas?: number;
};

export type FilterLotesInput = {
  estado?: EstadoLote;
  nombre?: string;
};

export abstract class LoteRepository {
  abstract findAllByUser(): Promise<Lote[]>;
  abstract findById(id: string): Promise<Lote | null>;
  abstract findWithFilters(filters: FilterLotesInput): Promise<Lote[]>;
  abstract create(input: CreateLoteInput): Promise<Lote>;
  abstract update(id: string, input: UpdateLoteInput): Promise<Lote>;
  abstract delete(id: string): Promise<void>;
}
