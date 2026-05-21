import { Lot } from "../entities/lot.entity";

export abstract class LotRepository {
  abstract findByName(nombre?: string): Promise<Lot[]>;
}
