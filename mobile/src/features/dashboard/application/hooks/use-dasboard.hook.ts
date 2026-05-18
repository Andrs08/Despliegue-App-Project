import { useEffect, useState, useCallback } from "react";
import { LocalPreferencesAsyncStorage } from "../../../../core/LocalPreferencesAsyncStorage";
import { ApiDashboardRepository } from "../../infrastructure/persistence/api-dashboard.repository";
import { GetDashboardUseCase } from "../use-cases/get-dashboard.use-case";
import { DashboardData } from "../../domain/interfaces/dashboard.interfaces";

const storage = LocalPreferencesAsyncStorage.getInstance();
const repository = new ApiDashboardRepository(storage);
const getDashboardUseCase = new GetDashboardUseCase(repository);

interface UseDashboardResult {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  isFromCache: boolean;
  refresh: () => Promise<void>;
}

export function useDashboard(): UseDashboardResult {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFromCache, setIsFromCache] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const cached = await repository.getCachedDashboard();
      if (cached) {
        setData(cached);
        setIsFromCache(true);
      }

      const fresh = await getDashboardUseCase.execute();
      setData(fresh);
      setIsFromCache(false);
    } catch (e: any) {
      setError(e?.message ?? "Error al cargar el dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, isFromCache, refresh: load };
}
