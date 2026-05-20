import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AlertModule } from '../alert/alert.module';
import { LoteModule } from '../lots/lot.module';
import { IrrigationScheduler } from './irrigation.scheduler';

@Module({
  imports: [AlertModule, LoteModule],

  providers: [IrrigationScheduler],
})
export class SchedulerModule {}
