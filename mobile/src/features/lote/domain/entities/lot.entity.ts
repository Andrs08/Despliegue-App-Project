export type EstadoLote = "Sano" | "Observación" | "Riesgo";

export type EtapaLote =
  | "preparacion_suelo"
  | "siembra"
  | "desarrollo_vegetativo"
  | "floracion"
  | "fructificacion"
  | "cosecha";

export class Lote {
  constructor(
    public readonly id: string,
    public readonly usuarioId: string,
    public readonly nombre: string,
    public readonly hectareas: number,
    public readonly temperaturaMinima: number,
    public readonly temperaturaMaxima: number,
    public readonly etapaActualId: number,
    public readonly fechaInicio: string,
    public readonly numeroPlantas: number,
    public readonly estado: EstadoLote,
  ) {}
}
