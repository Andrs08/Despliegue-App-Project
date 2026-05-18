export class GetLotStatusUseCase {
  constructor(private repository: any) {}

  async execute(userId: string) {
    return this.repository.getLotStatus(userId);
  }
}
