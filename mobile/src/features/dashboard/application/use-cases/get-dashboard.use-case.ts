import { DashboardRepository } from "../../domain/repositories/dashboard.repository";
import { DashboardData } from "../../domain/interfaces/dashboard.interfaces";

const CACHE_TTL_MS = 5 * 60 * 1000;

export interface DashboardResult {
  data: DashboardData;
  userName: string | null;
  fromCache: boolean;
  isStale: boolean;
}

export interface DashboardCallbacks {
  onCacheHit: (result: DashboardResult) => void;
  onFresh: (result: DashboardResult) => void;
  onError: (error: Error) => void;
}

export class GetDashboardUseCase {
  constructor(private repository: DashboardRepository) { }

  async execute(callbacks: DashboardCallbacks): Promise<void> {
    const userName = await this.repository.getUserName();

    const cached = await this.repository.getCachedDashboard();
    let hadCache = false;

    if (cached) {
      hadCache = true;
      const ageMs = Date.now() - cached.cachedAt;
      const isStale = ageMs > CACHE_TTL_MS;

      callbacks.onCacheHit({
        data: cached.data,
        userName,
        fromCache: true,
        isStale,
      });
    }

    try {
      const [summary, lotStatus, stageDistribution, activeAlerts, production] =
        await Promise.all([
          this.repository.getSummary(),
          this.repository.getLotStatus(),
          this.repository.getStageDistribution(),
          this.repository.getActiveAlerts(),
          this.repository.getProduction(),
        ]);

      const freshData: DashboardData = {
        summary,
        lotStatus,
        stageDistribution,
        activeAlerts,
        production,
      };

      await this.repository.cacheDashboard(freshData);

      callbacks.onFresh({
        data: freshData,
        userName,
        fromCache: false,
        isStale: false,
      });
    } catch (error) {
      if (!hadCache) {
        callbacks.onError(
          error instanceof Error
            ? error
            : new Error("Sin conexión y sin datos en caché")
        );
      }
    }
  }
}