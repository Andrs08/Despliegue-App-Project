import { ILocalPreferences } from "../../../../core/iLocalPreferences";
import { DashboardRepository } from "../../domain/repositories/dashboard.repository";
import {
  GeneralSummary,
  LotStatus,
  StageDistribution,
  ActiveAlerts,
  Production,
  DashboardData,
} from "../../domain/interfaces/dashboard.interfaces";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const CACHE_KEY = process.env.EXPO_PUBLIC_CACHE_KEY;
const SESSION_TOKEN = process.env.EXPO_PUBLIC_LOCAL_TOKEN;
const SESSION_NAME = process.env.EXPO_PUBLIC_LOCAL_USER_NAME

export class ApiDashboardRepository implements DashboardRepository {
  constructor(private storage: ILocalPreferences) {}

  private async getToken(): Promise<string> {
    const token = await this.storage.retrieveData<string>(SESSION_TOKEN!);
    if (!token) throw new Error("No autenticado");
    return token;
  }

  private async get<T>(path: string): Promise<T> {
    const token = await this.getToken();
    const response = await fetch(`${BASE_URL}${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status} en ${path}`);
    }
    return response.json() as Promise<T>;
  }

  getSummary(): Promise<GeneralSummary> {
    return this.get<GeneralSummary>("/dashboard/summary");
  }

  getLotStatus(): Promise<LotStatus> {
    return this.get<LotStatus>("/dashboard/lot-status");
  }

  getStageDistribution(): Promise<StageDistribution[]> {
    return this.get<StageDistribution[]>("/dashboard/stage-distribution");
  }

  getActiveAlerts(): Promise<ActiveAlerts> {
    return this.get<ActiveAlerts>("/dashboard/active-alerts");
  }

  getProduction(): Promise<Production[]> {
    return this.get<Production[]>("/dashboard/production");
  }

  async getCachedDashboard(): Promise<DashboardData | null> {
    return this.storage.retrieveData<DashboardData>(CACHE_KEY!);
  }

  async cacheDashboard(data: DashboardData): Promise<void> {
    return this.storage.storeData<DashboardData>(CACHE_KEY!, data);
  }

  async getUserName(): Promise<string | null> {
    const name = await this.storage.retrieveData<string>(SESSION_NAME!);
    return name ?? null;
  }
}
