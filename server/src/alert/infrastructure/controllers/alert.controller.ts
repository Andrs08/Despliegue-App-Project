import { Controller, Get, Put, Post, Param, Body, UseGuards } from '@nestjs/common';
import { CreateAlertUseCase } from '../../application/use-cases/create-alert.use-case';
import { GetAlertsUseCase } from '../../application/use-cases/get-alerts.use-case';
import { GetLotAlertsUseCase } from '../../application/use-cases/get-lot-alerts.use-case';
import { MarkAlertAsResolvedUseCase } from '../../application/use-cases/mark-alert-as-resolved.use-case';
import { CreateAlertDTO } from '../dtos/create-alert.dto';
import { JwtGuard } from 'src/auth/infrastructure/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('alerts')
export class AlertController {
  constructor(
    private createUseCase: CreateAlertUseCase,
    private getAlertsUseCase: GetAlertsUseCase,
    private getLotAlertsUseCase: GetLotAlertsUseCase,
    private markAsResolvedUseCase: MarkAlertAsResolvedUseCase,
  ) {}

  @Post()
  create(@Body() body: CreateAlertDTO) {
    return this.createUseCase.execute(body);
  }

  @Get()
  findAll() {
    return this.getAlertsUseCase.execute();
  }

  @Get('lot/:loteId')
  findByLote(
    @Param('loteId')
    loteId: string,
  ) {
    return this.getLotAlertsUseCase.execute(loteId);
  }

  @Put(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.markAsResolvedUseCase.execute(id);
  }
}
