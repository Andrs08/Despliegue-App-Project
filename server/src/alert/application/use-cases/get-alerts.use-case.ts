export class GetAlertsUseCase {
  constructor(private repository: any) {}

  async execute(userId: string) {
    return this.repository.findAll(userId);
  }
}
