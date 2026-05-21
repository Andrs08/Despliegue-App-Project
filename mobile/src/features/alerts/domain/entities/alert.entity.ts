export type AlertNivel = "ALTO" | "MEDIO" | "BAJO";

export class Alert {
  constructor(
    public id: string,
    public loteId: string,
    public tipo: string,
    public nivel: AlertNivel,
    public mensaje: string,
    public resuelta: boolean = false,
    public createdAt?: Date,
  ) {}
}
