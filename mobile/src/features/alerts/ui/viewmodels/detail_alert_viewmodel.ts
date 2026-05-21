import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from "../../domain/entities/alert.entity";
import { GetLotAlertsUseCase } from "../../application/use-cases/get-lot-alerts.use-case";
import { MarkAlertAsResolvedUseCase } from "../../application/use-cases/mark-alert-as-resolved.use-case";
import { ApiAlertRepository } from "../../infrastructure/persistence/api-alert.repository";
import { AlertItem, AlertStatus } from "./alerts_viewmodel";
import { LocalPreferencesAsyncStorage } from "@/src/core/LocalPreferencesAsyncStorage";

export type DetailAlertFilter =
  | "Todas"
  | "Alertas activas"
  | "Alertas resueltas";

const ALL_FILTERS: DetailAlertFilter[] = [
  "Todas",
  "Alertas activas",
  "Alertas resueltas",
];

function formatTimeAgo(date?: Date): string {
  if (!date) return "";
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Hoy";
  if (diffDays === 1) return "Hace 1 día";
  return `Hace ${diffDays} días`;
}

function alertToItem(alert: Alert): AlertItem {
  type S = "Crítica" | "Preventiva" | "Informativa";
  const nivelMap: Record<string, S> = {
    ALTO: "Crítica",
    MEDIO: "Preventiva",
    BAJO: "Informativa",
  };

  return {
    id: alert.id,
    title: alert.mensaje,
    timeAgo: formatTimeAgo(alert.createdAt),
    severity: nivelMap[alert.nivel] ?? "Informativa",
    status: alert.resuelta ? "Resuelta" : "Activa",
  };
}

const storage = LocalPreferencesAsyncStorage.getInstance();
const alertRepository = new ApiAlertRepository(storage);
const getLotAlertsUseCase = new GetLotAlertsUseCase(alertRepository);
const markAsResolvedUseCase = new MarkAlertAsResolvedUseCase(alertRepository);

export type AlertDistribution = {
  criticas: number;
  preventivas: number;
  informativas: number;
};

type UseDetailAlertViewModelParams = {
  lotId: string;
  lotName: string;
  onNotFound: () => void;
};

export function useDetailAlertViewModel({
  lotId,
  lotName,
  onNotFound,
}: UseDetailAlertViewModelParams) {
  const [selectedFilter, setSelectedFilter] =
    useState<DetailAlertFilter>("Todas");
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    getLotAlertsUseCase
      .execute(lotId)
      .then((data) => {
        if (data === null) {
          onNotFound();
        } else {
          setAlerts(data);
          setError(null);
        }
      })
      .catch(() => setError("No se pudieron cargar las alertas del lote"))
      .finally(() => setIsLoading(false));
  }, [lotId]);

  const alertItems = useMemo(() => alerts.map(alertToItem), [alerts]);

  const filteredAlerts = useMemo<AlertItem[]>(() => {
    if (selectedFilter === "Todas") return alertItems;

    const expectedStatus: AlertStatus =
      selectedFilter === "Alertas activas" ? "Activa" : "Resuelta";

    return alertItems.filter((a) => a.status === expectedStatus);
  }, [alertItems, selectedFilter]);

  // Counts per category (based on nivel, only active alerts for chart)
  const counts = useMemo(() => {
    const criticas = alerts.filter(
      (a) => !a.resuelta && a.nivel === "ALTO",
    ).length;
    const preventivas = alerts.filter(
      (a) => !a.resuelta && a.nivel === "MEDIO",
    ).length;
    const informativas = alerts.filter(
      (a) => !a.resuelta && a.nivel === "BAJO",
    ).length;
    const resueltas = alerts.filter((a) => a.resuelta).length;
    return { criticas, preventivas, informativas, resueltas };
  }, [alerts]);

  // Chart data: shows count AND percentage, only segments with value > 0
  const chartData = useMemo(() => {
    const total = alerts.length;
    if (total === 0) return [];

    const allSegments = [
      {
        key: "criticas",
        label: "Alertas críticas",
        count: counts.criticas,
        value: parseFloat(((counts.criticas / total) * 100).toFixed(1)),
        color: "#E4568B",
      },
      {
        key: "preventivas",
        label: "Alertas preventivas",
        count: counts.preventivas,
        value: parseFloat(((counts.preventivas / total) * 100).toFixed(1)),
        color: "#F6C94D",
      },
      {
        key: "informativas",
        label: "Alertas informativas",
        count: counts.informativas,
        value: parseFloat(((counts.informativas / total) * 100).toFixed(1)),
        color: "#5D7B3D",
      },
      {
        key: "resueltas",
        label: "Alertas resueltas",
        count: counts.resueltas,
        value: parseFloat(((counts.resueltas / total) * 100).toFixed(1)),
        color: "#959595",
      },
    ];

    return allSegments.filter((s) => s.value > 0);
  }, [alerts, counts]);

  // Only show filters that have actual alerts (active, resolved, or both)
  const hasActiveAlerts =
    counts.criticas + counts.preventivas + counts.informativas > 0;
  const hasResolvedAlerts = counts.resueltas > 0;

  const filters = useMemo<DetailAlertFilter[]>(() => {
    if (!hasActiveAlerts && !hasResolvedAlerts) return [];
    const result: DetailAlertFilter[] = ["Todas"];
    if (hasActiveAlerts) result.push("Alertas activas");
    if (hasResolvedAlerts) result.push("Alertas resueltas");
    return result;
  }, [hasActiveAlerts, hasResolvedAlerts]);

  const handleSelectFilter = useCallback((filter: DetailAlertFilter) => {
    setSelectedFilter(filter);
  }, []);

  const handleToggleOptionsMenu = useCallback(() => {
    setShowOptionsMenu((v) => !v);
  }, []);

  const handleResolveActiveAlerts = useCallback(async () => {
    const activeAlerts = alerts.filter((a) => !a.resuelta);

    try {
      await Promise.all(
        activeAlerts.map((a) => markAsResolvedUseCase.execute(a.id)),
      );
      setAlerts((prev) =>
        prev.map((a) => (a.resuelta ? a : { ...a, resuelta: true })),
      );
    } catch {
      setError("No se pudieron resolver todas las alertas");
    } finally {
      setShowOptionsMenu(false);
    }
  }, [alerts]);

  return {
    lot: { id: lotId, lotName },
    filters,
    selectedFilter,
    filteredAlerts,
    chartData,
    hasAlerts: alerts.length > 0,
    showOptionsMenu,
    isLoading,
    error,
    handleSelectFilter,
    handleToggleOptionsMenu,
    handleResolveActiveAlerts,
  };
}
