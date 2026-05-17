export class GetGeneralSummaryUseCase {
  constructor(private repository: any) {}

  async execute(userId: string) {
    return this.repository.getGeneralSummary(userId);
  }
}
