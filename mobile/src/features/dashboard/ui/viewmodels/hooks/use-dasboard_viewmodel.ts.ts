import { useEffect, useState, useCallback, useRef } from "react";
import { LocalPreferencesAsyncStorage } from "../../../../../core/LocalPreferencesAsyncStorage";
import { ApiDashboardRepository } from "../../../infrastructure/persistence/api-dashboard.repository";
import {
  GetDashboardUseCase,
  DashboardResult,
} from "../../../application/use-cases/get-dashboard.use-case";
import { DashboardData } from "../../../domain/interfaces/dashboard.interfaces";

const storage = LocalPreferencesAsyncStorage.getInstance();
const repository = new ApiDashboardRepository(storage);
const getDashboardUseCase = new GetDashboardUseCase(repository);

interface UseDashboardResult {
  data: DashboardData | null;
  userName: string | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  fromCache: boolean;
  isStale: boolean;
  refresh: () => void;
}

export function useDashboard(): UseDashboardResult {
  const [data, setData] = useState<DashboardData | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);
  const [isStale, setIsStale] = useState(false);

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const applyResult = useCallback((result: DashboardResult) => {
    if (!mountedRef.current) return;
    setData(result.data);
    setUserName(result.userName);
    setFromCache(result.fromCache);
    setIsStale(result.isStale);
    setError(null);
  }, []);

  const load = useCallback(() => {
    if (!mountedRef.current) return;

    setError(null);

    setLoading((prev) => (data === null ? true : prev));
    setRefreshing(true);

    getDashboardUseCase.execute({
      onCacheHit: (result) => {
        if (!mountedRef.current) return;
        applyResult(result);
        setLoading(false);
      },

      onFresh: (result) => {
        if (!mountedRef.current) return;
        applyResult(result);
        setLoading(false);
        setRefreshing(false);
      },

      onError: (err) => {
        if (!mountedRef.current) return;
        setError(err.message ?? "Error al cargar el dashboard");
        setLoading(false);
        setRefreshing(false);
      },
    });
  }, [applyResult, data]);

  useEffect(() => {
    load();
  }, []);

  return {
    data,
    userName,
    loading,
    refreshing,
    error,
    fromCache,
    isStale,
    refresh: load,
  };
}