import { useMemo, useState } from "react";
import {
  ALERTS_LOTS_MOCK,
  AlertLotItem,
  AlertStatus,
} from "./alerts_viewmodel";

export type DetailAlertFilter =
  | "Todas"
  | "Alertas activas"
  | "Alertas resueltas";

type UseDetailAlertViewModelParams = {
  lotId: number;
  onNotFound: () => void;
};

const FILTERS: DetailAlertFilter[] = [
  "Todas",
  "Alertas activas",
  "Alertas resueltas",
];

export function useDetailAlertViewModel({
  lotId,
  onNotFound,
}: UseDetailAlertViewModelParams) {
  const [selectedFilter, setSelectedFilter] =
    useState<DetailAlertFilter>("Todas");
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [localLot, setLocalLot] = useState<AlertLotItem | null>(() => {
    return ALERTS_LOTS_MOCK.find((item) => item.id === lotId) ?? null;
  });

  if (!localLot) {
    onNotFound();
  }

  const filteredAlerts = useMemo(() => {
    if (!localLot) {
      return [];
    }

    if (selectedFilter === "Todas") {
      return localLot.alerts;
    }

    const expectedStatus: AlertStatus =
      selectedFilter === "Alertas activas" ? "Activa" : "Resuelta";

    return localLot.alerts.filter((alert) => alert.status === expectedStatus);
  }, [localLot, selectedFilter]);

  const chartData = useMemo(() => {
    if (!localLot) {
      return [];
    }

    return [
      {
        key: "sano",
        label: "Sano",
        value: localLot.distribution.sano,
        color: "#5D7B3D",
      },
      {
        key: "observacion",
        label: "Observación",
        value: localLot.distribution.observacion,
        color: "#F6C94D",
      },
      {
        key: "riesgo",
        label: "Riesgo",
        value: localLot.distribution.riesgo,
        color: "#E4568B",
      },
    ];
  }, [localLot]);

  const handleSelectFilter = (filter: DetailAlertFilter) => {
    setSelectedFilter(filter);
  };

  const handleToggleOptionsMenu = () => {
    setShowOptionsMenu((currentValue) => !currentValue);
  };

  const handleResolveActiveAlerts = () => {
    if (!localLot) {
      return;
    }

    const updatedAlerts = localLot.alerts.map((alert) => {
      if (alert.status === "Activa") {
        return {
          ...alert,
          status: "Resuelta" as const,
        };
      }

      return alert;
    });

    setLocalLot({
      ...localLot,
      alerts: updatedAlerts,
    });

    setShowOptionsMenu(false);
  };

  return {
    lot: localLot,
    filters: FILTERS,
    selectedFilter,
    filteredAlerts,
    chartData,
    showOptionsMenu,
    handleSelectFilter,
    handleToggleOptionsMenu,
    handleResolveActiveAlerts,
  };
}