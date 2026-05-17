export class GetAlertsUseCase {
  constructor(private repository: any) {}

  async execute() {
    return this.repository.findAll();
  }
}
