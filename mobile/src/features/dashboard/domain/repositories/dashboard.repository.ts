import {
  GeneralSummary,
  LotStatus,
  StageDistribution,
  ActiveAlerts,
  Production,
  DashboardData,
} from "../interfaces/dashboard.interfaces";

export interface DashboardRepository {
  getSummary(): Promise<GeneralSummary>;
  getLotStatus(): Promise<LotStatus>;
  getStageDistribution(): Promise<StageDistribution[]>;
  getActiveAlerts(): Promise<ActiveAlerts>;
  getProduction(): Promise<Production[]>;

  getCachedDashboard(): Promise<DashboardData | null>;
  cacheDashboard(data: DashboardData): Promise<void>;

  getUserName(): Promise<string | null>;
}
