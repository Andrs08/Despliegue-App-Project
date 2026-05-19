export interface Note {
  id: string;
  lote_id: string | null;
  titulo: string;
  description: string;
  imagen_url: string | null;
  fecha: Date;
  usuario_id: string;
  created_at?: Date;
}
