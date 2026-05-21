import { BitacoraRouteItem } from "@/src/core/navigation/app_navigator";

export interface INotesRepository {
  create(
    title: string,
    description: string,
    lotId: string | null,
    imageUri: string | null,
  ): Promise<void>;
  findAllByUser(): Promise<BitacoraRouteItem[]>;
  update(
    id: string,
    title: string,
    description: string,
    imageUri: string | null,
  ): Promise<void>;
  delete(id: string): Promise<void>;
}
