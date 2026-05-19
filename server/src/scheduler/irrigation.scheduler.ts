import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { GenerateIrrigationAlertsUseCase } from 'src/alert/application/use-cases/generate-irrigation-alerts.use-case';
GenerateIrrigationAlertsUseCase;

@Injectable()
export class IrrigationScheduler {
  constructor(private generateAlerts: GenerateIrrigationAlertsUseCase) {}
  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async handleCron() {
    console.log('se esta ejecutando el cron');
    await this.generateAlerts.execute();
  }
}
