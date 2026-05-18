import { DashboardRepository } from "../../domain/repositories/dashboard.repository";
import { DashboardData } from "../../domain/interfaces/dashboard.interfaces";

export class GetDashboardUseCase {
  constructor(private repository: DashboardRepository) {}

  async execute(): Promise<DashboardData> {
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

      return data;
    } catch (error) {
      const cached = await this.repository.getCachedDashboard();
      if (cached) return cached;
      throw error;
    }
  }
}
