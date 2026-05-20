import { FilterLotsDTO } from 'src/lots/infrastructure/dtos/filter-lot-by-status.dto';
import { Lot } from '../entities/lot.entity';

export abstract class LoteRepository {
  abstract create(lote: Lot): Promise<Lot | null>;
  abstract findAllByUser(userId: string): Promise<Lot[] | null>;
  abstract findById(id: string): Promise<Lot | null>;
  abstract update(id: string, data: Partial<Lot>): Promise<Lot | null>;
  abstract delete(id: string): Promise<void>;
  abstract findWithFilters(userId: string, filters: FilterLotsDTO): Promise<Lot[]>;
}
