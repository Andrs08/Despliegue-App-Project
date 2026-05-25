import { Module } from '@nestjs/common';
import { DashboardController } from './infrastructure/controllers/dashboard.controller';
import { PrismaDashboardRepository } from './infrastructure/persistence/prisma-dashboard.repository';
import { GetGeneralSummaryUseCase } from './application/use-cases/get-general-summary.use-case';
import { GetLotStatusUseCase } from './application/use-cases/get-lot-status.use-case';
import { GetStageDistributionUseCase } from './application/use-cases/get-stage-distribution.use-case';
import { GetActiveAlertsUseCase } from './application/use-cases/get-active-alerts.use-case';
import { GetProductionByLotUseCase } from './application/use-cases/get-production-by-lot.use-case';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DashboardController],
  providers: [
    PrismaDashboardRepository,

    {
      provide: GetGeneralSummaryUseCase,
      useFactory: (repository: PrismaDashboardRepository) =>
        new GetGeneralSummaryUseCase(repository),
      inject: [PrismaDashboardRepository],
    },

    {
      provide: GetLotStatusUseCase,
      useFactory: (repository: PrismaDashboardRepository) =>
        new GetLotStatusUseCase(repository),
      inject: [PrismaDashboardRepository],
    },

    {
      provide: GetStageDistributionUseCase,
      useFactory: (repository: PrismaDashboardRepository) =>
        new GetStageDistributionUseCase(repository),
      inject: [PrismaDashboardRepository],
    },

    {
      provide: GetActiveAlertsUseCase,
      useFactory: (repository: PrismaDashboardRepository) =>
        new GetActiveAlertsUseCase(repository),
      inject: [PrismaDashboardRepository],
    },

    {
      provide: GetProductionByLotUseCase,
      useFactory: (repository: PrismaDashboardRepository) =>
        new GetProductionByLotUseCase(repository),
      inject: [PrismaDashboardRepository],
    },
  ],
})
export class DashboardModule {}
