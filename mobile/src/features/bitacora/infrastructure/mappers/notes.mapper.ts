import { BitacoraRouteItem } from "@/src/core/navigation/app_navigator";
import { Note } from "../../domain/interfaces/note.interface";

export function mapServerToNavigationItem(serverItem: Note): BitacoraRouteItem {
  return {
    id: serverItem.id as any,

    title: serverItem.titulo,
    description: serverItem.description,
    imageUri: serverItem.imagen_url,
    lot: serverItem.lote_id ? serverItem.lote_id : "Sin Lote",
    createdAt: serverItem.created_at
      ? String(serverItem.created_at)
      : String(serverItem.fecha),
  };
}
