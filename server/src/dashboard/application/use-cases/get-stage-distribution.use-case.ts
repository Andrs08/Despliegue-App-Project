export class GetStageDistributionUseCase {
  constructor(private repository: any) {}

  async execute(userId: string) {
    return this.repository.getStageDistribution(userId);
  }
}
