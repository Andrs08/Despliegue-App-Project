import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from "../../domain/entities/alert.entity";
import { Lot } from "../../domain/entities/lot.entity";
import { GetAlertsUseCase } from "../../application/use-cases/get-alerts.use-case";
import { GetFilteredLotsUseCase } from "../../application/use-cases/get-filtered-lots.use-case";
import { ApiAlertRepository } from "../../infrastructure/persistence/api-alert.repository";
import { ApiLotRepository } from "../../infrastructure/persistence/api-lot.repository";
import { LocalPreferencesAsyncStorage } from "../../../../core/LocalPreferencesAsyncStorage";

export type AlertSeverity = "Informativa" | "Preventiva" | "Crítica";
export type AlertStatus = "Activa" | "Resuelta";

export type AlertItem = {
  id: string;
  title: string;
  timeAgo: string;
  severity: AlertSeverity;
  status: AlertStatus;
};

export type AlertLotItem = {
  id: string;
  lotName: string;
  alerts: AlertItem[];
};

function nivelToSeverity(nivel: string): AlertSeverity {
  if (nivel === "ALTO") return "Crítica";
  if (nivel === "MEDIO") return "Preventiva";
  return "Informativa";
}

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
  return {
    id: alert.id,
    title: alert.mensaje,
    timeAgo: formatTimeAgo(alert.createdAt),
    severity: nivelToSeverity(alert.nivel),
    status: alert.resuelta ? "Resuelta" : "Activa",
  };
}

export function getAlertLotDotColor(lot: AlertLotItem): string {
  const totals = lot.alerts.reduce(
    (acc, alert) => {
      acc[alert.severity] += 1;
      return acc;
    },
    { Informativa: 0, Preventiva: 0, Crítica: 0 } as Record<
      AlertSeverity,
      number
    >,
  );

  if (
    totals["Crítica"] >= totals["Preventiva"] &&
    totals["Crítica"] >= totals["Informativa"]
  ) {
    return "#FDE7EC";
  }

  if (
    totals["Preventiva"] >= totals["Informativa"] &&
    totals["Preventiva"] >= totals["Crítica"]
  ) {
    return "#FFF5E1";
  }

  return "#E8F1FB";
}

const storage =  LocalPreferencesAsyncStorage.getInstance();
const alertRepository = new ApiAlertRepository(storage);
const lotRepository = new ApiLotRepository(storage);
const getAlertsUseCase = new GetAlertsUseCase(alertRepository);
const getFilteredLotsUseCase = new GetFilteredLotsUseCase(lotRepository);

type UseAlertsViewModelParams = {
  onOpenDetail: (lotId: string) => void;
};

export function useAlertsViewModel({ onOpenDetail }: UseAlertsViewModelParams) {
  const [searchText, setSearchText] = useState("");
  const [allAlerts, setAllAlerts] = useState<Alert[]>([]);
  const [lots, setLots] = useState<Lot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAlertsUseCase
      .execute()
      .then(setAllAlerts)
      .catch(() => setError("No se pudieron cargar las alertas"));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    const timer = setTimeout(() => {
      getFilteredLotsUseCase
        .execute(searchText.trim() || undefined)
        .then((data) => {
          if (!cancelled) {
            setLots(data);
            setError(null);
          }
        })
        .catch(() => {
          if (!cancelled) setError("No se pudieron cargar los lotes");
        })
        .finally(() => {
          if (!cancelled) setIsLoading(false);
        });
    }, 350);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [searchText]);

  const summaryCards = useMemo(() => {
    const alertItems = allAlerts.map(alertToItem);

    const critical = alertItems.filter((a) => a.severity === "Crítica").length;
    const preventive = alertItems.filter(
      (a) => a.severity === "Preventiva",
    ).length;
    const informative = alertItems.filter(
      (a) => a.severity === "Informativa",
    ).length;

    return [
      {
        key: "critical",
        count: critical,
        label: "Alertas\ncrítica",
        color: "#E4568B",
        borderColor: "#E4568B",
      },
      {
        key: "preventive",
        count: preventive,
        label: "Alertas\npreventiva",
        color: "#F6C94D",
        borderColor: "#F6C94D",
      },
      {
        key: "informative",
        count: informative,
        label: "Alertas\ninformativas",
        color: "#4A7DBA",
        borderColor: "#4A7DBA",
      },
    ];
  }, [allAlerts]);

  const alertLots = useMemo<AlertLotItem[]>(() => {
    return lots.map((lot) => {
      const lotAlerts = allAlerts
        .filter((a) => a.loteId === lot.id)
        .map(alertToItem);

      return {
        id: lot.id,
        lotName: lot.nombre,
        alerts: lotAlerts,
      };
    });
  }, [lots, allAlerts]);

  const handleSearchChange = useCallback((text: string) => {
    setSearchText(text);
  }, []);

  const handleOpenDetail = useCallback(
    (lotId: string) => {
      onOpenDetail(lotId);
    },
    [onOpenDetail],
  );

  return {
    summaryCards,
    lots: alertLots,
    searchText,
    isLoading,
    error,
    handleSearchChange,
    handleOpenDetail,
  };
}
