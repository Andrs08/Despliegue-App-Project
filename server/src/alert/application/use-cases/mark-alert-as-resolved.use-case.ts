export class MarkAlertAsResolvedUseCase {
  constructor(private repository: any) {}

  async execute(id: string) {
    return this.repository.markAsResolved(id);
  }
}
