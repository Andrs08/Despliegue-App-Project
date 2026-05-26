export class GetLotAlertsUseCase {
  constructor(private repository: any) {}

  async execute(loteId: string, userId: string) {
    return this.repository.findByLote(loteId, userId);
  }
}
