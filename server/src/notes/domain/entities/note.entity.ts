export class Note {
  constructor(
    public id: string,
    public lote_id: string | null,
    public titulo: string,
    public description: string,
    public imagen_url: string | null,
    public fecha: Date,
    public usuario_id: string,
    public created_at?: Date,
  ) {}
}
