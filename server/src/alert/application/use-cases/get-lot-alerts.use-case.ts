export class GetLotAlertsUseCase {
  constructor(private repository: any) {}

  async execute(loteId: string) {
    return this.repository.findByLote(loteId);
  }
}
