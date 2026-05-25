export class LoteAlert {
  constructor(
    public readonly id: string,
    public readonly loteId: string,
    public readonly tipo: string,
    public readonly nivel: string,
    public readonly mensaje: string,
    public readonly resuelta: boolean,
    public readonly createdAt: Date,
  ) {}
}
