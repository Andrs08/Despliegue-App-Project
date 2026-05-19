import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { NotesModule } from './notes/note.module';
import { LoteModule } from './lots/lot.module';
import { StageRecordModule } from './stage-record/stage-record.module';
import { AlertModule } from './alert/alert.module';
import { AgriculturalRulesModule } from './agricultural-rules/agricultural-rules.module';
import { SharedModule } from './shared/shared.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerModule } from './scheduler/irrigation.module';

@Module({
  imports: [
    SharedModule,
    AuthModule,
    DashboardModule,
    NotesModule,
    LoteModule,
    StageRecordModule,
    AlertModule,
    AgriculturalRulesModule,
    ScheduleModule.forRoot(),
    SchedulerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
