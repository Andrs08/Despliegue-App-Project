export class StageRecord {

  constructor(
    public id: string,
    public lote_id: string,
    public etapa_id: number,
    public datos: Record<string, any>,
    public fecha: Date,
    public created_at?: Date
  ) {}
}