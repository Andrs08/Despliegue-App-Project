export class GenerateIrrigationAlertsUseCase {
  constructor(
    private lotRepository: any,
    private alertRepository: any,
  ) {}

  async execute() {
    const lots = await this.lotRepository.findAllByUser();
    const today = new Date();

    for (const lot of lots) {
      if (lot.etapa_actual_id < 2) {
        continue;
      }
      const startDate = new Date(lot.fecha_inicio);
      const diffDays = Math.floor(
        (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      if (diffDays > 0 && diffDays % 3 === 0) {
        const existingAlert =
          await this.alertRepository.findIrrigationAlertToday(lot.id);
        if (existingAlert) {
          continue;
        }
        await this.alertRepository.create({
          id: crypto.randomUUID(),
          loteId: lot.id,
          tipo: 'RIEGO',
          nivel: 'MEDIO',
          mensaje: 'Se recomienda regar el cultivo.',
        });
      }
    }
  }
}
