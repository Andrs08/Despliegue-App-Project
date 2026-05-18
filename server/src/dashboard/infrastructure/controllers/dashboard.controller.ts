import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { GetGeneralSummaryUseCase } from '../../application/use-cases/get-general-summary.use-case';
import { GetLotStatusUseCase } from '../../application/use-cases/get-lot-status.use-case';
import { GetStageDistributionUseCase } from '../../application/use-cases/get-stage-distribution.use-case';
import { GetActiveAlertsUseCase } from '../../application/use-cases/get-active-alerts.use-case';
import { GetProductionByLotUseCase } from '../../application/use-cases/get-production-by-lot.use-case';
import { JwtGuard } from '../../../auth/infrastructure/guards/jwt.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Dashboard')
@ApiBearerAuth()
@Controller('dashboard')
@UseGuards(JwtGuard)
export class DashboardController {
  constructor(
    private summaryUseCase: GetGeneralSummaryUseCase,
    private lotStatusUseCase: GetLotStatusUseCase,
    private stageDistributionUseCase: GetStageDistributionUseCase,
    private activeAlertsUseCase: GetActiveAlertsUseCase,
    private productionUseCase: GetProductionByLotUseCase,
  ) {}

  @Get('summary')
  @ApiOperation({
    summary: 'Obtener resumen general del dashboard',
  })
  summary(@Req() req: any) {
    return this.summaryUseCase.execute(req.userId);
  }

  @Get('lot-status')
  @ApiOperation({
    summary: 'Obtener estado de los lotes(En riesgo, observacion o sano)',
  })
  lotStatus(@Req() req: any) {
    return this.lotStatusUseCase.execute(req.userId);
  }

  @Get('stage-distribution')
  @ApiOperation({
    summary: 'Obtener distribucion por etapa de los lotes',
  })
  stageDistribution(@Req() req: any) {
    return this.stageDistributionUseCase.execute(req.userId);
  }

  @Get('active-alerts')
  @ApiOperation({
    summary:
      'Obtener total de alertas activas y numero de alertas por cada nivel',
  })
  activeAlerts(@Req() req: any) {
    return this.activeAlertsUseCase.execute(req.userId);
  }

  @Get('production')
  @ApiOperation({
    summary:
      'Obtener produccion estimada del lote y produccion real(solo si aplica)',
  })
  production(@Req() req: any) {
    return this.productionUseCase.execute(req.userId);
  }
}
