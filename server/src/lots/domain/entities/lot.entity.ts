export class Lot {
  constructor(
    public id: string,
    public usuario_id: string,
    public nombre: string,
    public hectareas: number,
    public temperatura_min: number,
    public temperatura_max: number,
    public etapa_actual_id: number,
    public fecha_inicio: Date,
    public numero_plantas: number,
    public estado?: string,
  ) {}
}
