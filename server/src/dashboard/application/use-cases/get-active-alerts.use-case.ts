export class GetActiveAlertsUseCase {
  constructor(private repository: any) {}

  async execute(userId: string) {
    return this.repository.getActiveAlerts(userId);
  }
}
