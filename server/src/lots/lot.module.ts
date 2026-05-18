import { Module } from '@nestjs/common';
import { LoteController } from './infrastructure/controllers/lot.controller';
import { PrismaLoteRepository } from '../lots/infrastructure/persitence/prisma-lot.repository';
import { CreateLoteUseCase } from './application/use-cases/create-lote.use-case';
import { GetLotesUseCase } from './application/use-cases/get-lots.use-case';
import { GetLoteUseCase } from './application/use-cases/get-lot.use-case';
import { UpdateLoteUseCase } from './application/use-cases/update-lot.use-case';
import { DeleteLoteUseCase } from './application/use-cases/delete-lot.use-case';
import { PrismaModule } from '../prisma/prisma.module';
import { AlertModule } from 'src/alert/alert.module';
import { AgriculturalRulesModule } from 'src/agricultural-rules/agricultural-rules.module';
import { EvaluateLotUseCase } from 'src/agricultural-rules/application/use-cases/evaluate-lot.use-case';
import { CreateAlertUseCase } from 'src/alert/application/use-cases/create-alert.use-case';

@Module({
  imports: [PrismaModule, AlertModule, AgriculturalRulesModule],
  controllers: [LoteController],
  providers: [
    PrismaLoteRepository,
    {
      provide: CreateLoteUseCase,
      useFactory: (
        repo: PrismaLoteRepository,
        evaluateLot: EvaluateLotUseCase,
        createAlert: CreateAlertUseCase,
      ) => new CreateLoteUseCase(repo, evaluateLot, createAlert),
      inject: [PrismaLoteRepository, EvaluateLotUseCase, CreateAlertUseCase],
    },
    {
      provide: GetLotesUseCase,
      useFactory: (repo: PrismaLoteRepository) => new GetLotesUseCase(repo),
      inject: [PrismaLoteRepository],
    },
    {
      provide: GetLoteUseCase,
      useFactory: (repo: PrismaLoteRepository) => new GetLoteUseCase(repo),
      inject: [PrismaLoteRepository],
    },
    {
      provide: UpdateLoteUseCase,
      useFactory: (repo: PrismaLoteRepository) => new UpdateLoteUseCase(repo),
      inject: [PrismaLoteRepository],
    },
    {
      provide: DeleteLoteUseCase,
      useFactory: (repo: PrismaLoteRepository) => new DeleteLoteUseCase(repo),
      inject: [PrismaLoteRepository],
    },
  ],
})
export class LoteModule {}
