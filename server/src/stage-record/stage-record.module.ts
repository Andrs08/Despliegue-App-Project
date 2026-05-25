import { Module } from '@nestjs/common';
import { StageRecordController } from './infrastructure/controllers/stage-record.controller';
import { PrismaStageRecordRepository } from './infrastructure/persistence/prisma-stage-record.repository';
import { CreateStageRecordUseCase } from './application/use-cases/create-stage-record.use-case';
import { GetStageRecordsUseCase } from './application/use-cases/get-stage-records.use-case';
import { UpdateStageRecordUseCase } from './application/use-cases/update-stage-record.use-case';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AgriculturalRulesModule } from '../agricultural-rules/agricultural-rules.module';
import { AlertModule } from '../alert/alert.module';
import { EvaluateStageRecordUseCase } from '../agricultural-rules/application/use-cases/evaluate-stage-record.use-case';
import { CreateAlertUseCase } from '../alert/application/use-cases/create-alert.use-case';

@Module({
  imports: [PrismaModule, AgriculturalRulesModule, AlertModule],
  controllers: [StageRecordController],

  providers: [
    PrismaStageRecordRepository,
    {
      provide: CreateStageRecordUseCase,
      useFactory: (
        repository: PrismaStageRecordRepository,
        evaluateStageRecord: EvaluateStageRecordUseCase,
        createAlert: CreateAlertUseCase,
      ) =>
        new CreateStageRecordUseCase(
          repository,
          evaluateStageRecord,
          createAlert,
        ),

      inject: [
        PrismaStageRecordRepository,
        EvaluateStageRecordUseCase,
        CreateAlertUseCase,
      ],
    },
    {
      provide: GetStageRecordsUseCase,

      useFactory: (repository: PrismaStageRecordRepository) =>
        new GetStageRecordsUseCase(repository),

      inject: [PrismaStageRecordRepository],
    },

    {
      provide: UpdateStageRecordUseCase,

      useFactory: (repository: PrismaStageRecordRepository) =>
        new UpdateStageRecordUseCase(repository),

      inject: [PrismaStageRecordRepository],
    },
  ],
})
export class StageRecordModule {}
