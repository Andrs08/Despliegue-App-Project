import { Module } from '@nestjs/common';
import { AlertController } from './infrastructure/controllers/alert.controller';
import { PrismaAlertRepository } from './infrastructure/persistence/prisma-alert.repository';
import { CreateAlertUseCase } from './application/use-cases/create-alert.use-case';
import { GetAlertsUseCase } from './application/use-cases/get-alerts.use-case';
import { GetLotAlertsUseCase } from './application/use-cases/get-lot-alerts.use-case';
import { MarkAlertAsResolvedUseCase } from './application/use-cases/mark-alert-as-resolved.use-case';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AlertController],

  providers: [
    PrismaAlertRepository,

    {
      provide: CreateAlertUseCase,

      useFactory: (repository: PrismaAlertRepository) =>
        new CreateAlertUseCase(repository),

      inject: [PrismaAlertRepository],
    },

    {
      provide: GetAlertsUseCase,

      useFactory: (repository: PrismaAlertRepository) =>
        new GetAlertsUseCase(repository),

      inject: [PrismaAlertRepository],
    },

    {
      provide: GetLotAlertsUseCase,

      useFactory: (repository: PrismaAlertRepository) =>
        new GetLotAlertsUseCase(repository),

      inject: [PrismaAlertRepository],
    },

    {
      provide: MarkAlertAsResolvedUseCase,

      useFactory: (repository: PrismaAlertRepository) =>
        new MarkAlertAsResolvedUseCase(repository),

      inject: [PrismaAlertRepository],
    },
  ],

  exports: [CreateAlertUseCase],
})
export class AlertModule {}
