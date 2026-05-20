import { GeneralSummary } from '../interfaces/general-summary.interface';
import { ActiveAlerts } from '../interfaces/active-alerts.interface';
import { LotStatus } from '../interfaces/lot-status.interface';
import { Production } from '../interfaces/production-by-lot.interface';
import { StageDistribution } from '../interfaces/stage-distribution.interface';

export abstract class DashboardRepository {
  abstract getGeneralSummary(userId: string): Promise<GeneralSummary>;
  abstract getLotStatus(userId: string): Promise<LotStatus>;
  abstract getStageDistribution(userId: string): Promise<StageDistribution[]>;
  abstract getActiveAlerts(userId: string): Promise<ActiveAlerts>;
  abstract getProductionByLot(userId: string): Promise<Production[]>;
}
