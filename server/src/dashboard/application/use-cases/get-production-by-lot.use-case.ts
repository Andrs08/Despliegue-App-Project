export class GetProductionByLotUseCase {
  constructor(private repository: any) {}

  async execute(userId: string) {
    return this.repository.getProductionByLot(userId);
  }
}
