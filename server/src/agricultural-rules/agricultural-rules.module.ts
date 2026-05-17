import { Module } from '@nestjs/common';
import { TemperatureRules } from './domain/services/temperature.rules';
import { DensityRules } from './domain/services/density.rules';
import { IrrigationRules } from './domain/services/irrigation.rules';
import { DiseaseRules } from './domain/services/disease.rules';
import { HarvestRules } from './domain/services/harvest.rules';
import { StageRules } from './domain/services/stage.rules';
import { FertilizerRules } from './domain/services/fertilizer.rules';
import { DistanceRules } from './domain/services/distance.rules';
import { EvaluateLotUseCase } from './application/use-cases/evaluate-lot.use-case';
import { EvaluateStageRecordUseCase } from './application/use-cases/evaluate-stage-record.use-case';

@Module({
  providers: [
    TemperatureRules,
    DensityRules,
    IrrigationRules,
    DistanceRules,
    DiseaseRules,
    HarvestRules,
    StageRules,
    FertilizerRules,

    {
      provide: EvaluateLotUseCase,

      useFactory: (
        temperatureRules: TemperatureRules,
        densityRules: DensityRules,
        stageRules: StageRules,
      ) => new EvaluateLotUseCase(temperatureRules, densityRules, stageRules),

      inject: [TemperatureRules, DensityRules, StageRules],
    },

    {
      provide: EvaluateStageRecordUseCase,

      useFactory: (
        irrigationRules: IrrigationRules,
        distanceRules: DistanceRules,
        fertilizerRules: FertilizerRules,
        diseaseRules: DiseaseRules,
        harvestRules: HarvestRules,
      ) =>
        new EvaluateStageRecordUseCase(
          irrigationRules,
          distanceRules,
          fertilizerRules,
          diseaseRules,
          harvestRules,
        ),

      inject: [
        IrrigationRules,
        DistanceRules,
        FertilizerRules,
        DiseaseRules,
        HarvestRules,
      ],
    },
  ],

  exports: [EvaluateLotUseCase, EvaluateStageRecordUseCase],
})
export class AgriculturalRulesModule {}
