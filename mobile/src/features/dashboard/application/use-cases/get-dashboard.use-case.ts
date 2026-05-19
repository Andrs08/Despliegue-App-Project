import { DashboardRepository } from "../../domain/repositories/dashboard.repository";
import { DashboardData } from "../../domain/interfaces/dashboard.interfaces";

export interface DashboardResult {
  data: DashboardData;
  userName: string | null;
  fromCache: boolean;
}

export class GetDashboardUseCase {
  constructor(private repository: DashboardRepository) {}

  async execute(): Promise<DashboardResult> {

    const userName = await this.repository.getUserName();
    try {
      const [summary, lotStatus, stageDistribution, activeAlerts, production] =
        await Promise.all([
          this.repository.getSummary(),
          this.repository.getLotStatus(),
          this.repository.getStageDistribution(),
          this.repository.getActiveAlerts(),
          this.repository.getProduction(),
        ]);

      const data: DashboardData = {
        summary,
        lotStatus,
        stageDistribution,
        activeAlerts,
        production,
      };

      await this.repository.cacheDashboard(data);

      return { data, userName, fromCache: false };
    } catch (error) {
      const cached = await this.repository.getCachedDashboard();
      if (cached) return { data: cached, userName, fromCache: true };
      throw new Error("Sin conexión y sin datos en caché");
    }
  }
}
