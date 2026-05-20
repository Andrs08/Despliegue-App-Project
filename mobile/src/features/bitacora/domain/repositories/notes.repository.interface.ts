import { BitacoraRouteItem } from "@/src/core/navigation/app_navigator";

export interface INotesRepository {
  findAllByUser(): Promise<BitacoraRouteItem[]>;
  delete(id: string): Promise<void>;
}
