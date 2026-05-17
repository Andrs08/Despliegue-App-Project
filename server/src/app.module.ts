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

@Module({
  imports: [
    SharedModule,
    AuthModule,
    NotesModule,
    LoteModule,
    StageRecordModule,
    AlertModule,
    AgriculturalRulesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
