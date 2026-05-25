import {
  GeneralSummary,
  LotStatus,
  StageDistribution,
  ActiveAlerts,
  Production,
  DashboardData,
  DashboardCache,
} from "../interfaces/dashboard.interfaces";

export interface DashboardRepository {
  getSummary(): Promise<GeneralSummary>;
  getLotStatus(): Promise<LotStatus>;
  getStageDistribution(): Promise<StageDistribution[]>;
  getActiveAlerts(): Promise<ActiveAlerts>;
  getProduction(): Promise<Production[]>;
  getCachedDashboard(): Promise<DashboardCache | null>;
  cacheDashboard(data: DashboardData): Promise<void>;
  invalidateCache(): Promise<void>;
  getUserName(): Promise<string | null>;
}