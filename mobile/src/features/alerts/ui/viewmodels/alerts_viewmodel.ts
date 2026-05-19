import { useMemo, useState } from "react";

export type AlertSeverity = "Informativa" | "Preventiva" | "Crítica";
export type AlertStatus = "Activa" | "Resuelta";

export type AlertItem = {
  id: number;
  title: string;
  timeAgo: string;
  severity: AlertSeverity;
  status: AlertStatus;
};

export type AlertDistribution = {
  sano: number;
  observacion: number;
  riesgo: number;
};

export type AlertLotItem = {
  id: number;
  lotName: string;
  alerts: AlertItem[];
  distribution: AlertDistribution;
};

type UseAlertsViewModelParams = {
  onOpenDetail: (lotId: number) => void;
};

export const ALERTS_LOTS_MOCK: AlertLotItem[] = [
  {
    id: 1,
    lotName: "Lote a",
    distribution: {
      sano: 41.2,
      observacion: 35.3,
      riesgo: 23.5,
    },
    alerts: [
      {
        id: 101,
        title: "Falta de riego en algunas zonas",
        timeAgo: "Hace 2 días",
        severity: "Crítica",
        status: "Activa",
      },
      {
        id: 102,
        title: "Falta de riego en algunas zonas",
        timeAgo: "Hace 2 días",
        severity: "Crítica",
        status: "Activa",
      },
      {
        id: 103,
        title: "Riego normalizado en el lote",
        timeAgo: "Hace 3 días",
        severity: "Informativa",
        status: "Resuelta",
      },
      {
        id: 104,
        title: "Seguimiento preventivo completado",
        timeAgo: "Hace 5 días",
        severity: "Preventiva",
        status: "Resuelta",
      },
    ],
  },
  {
    id: 2,
    lotName: "Lote b",
    distribution: {
      sano: 38.4,
      observacion: 37.2,
      riesgo: 24.4,
    },
    alerts: [
      {
        id: 201,
        title: "Presencia de humedad irregular",
        timeAgo: "Hace 1 día",
        severity: "Preventiva",
        status: "Activa",
      },
      {
        id: 202,
        title: "Seguimiento de campo pendiente",
        timeAgo: "Hace 1 día",
        severity: "Preventiva",
        status: "Activa",
      },
      {
        id: 203,
        title: "Revisión de suelo recomendada",
        timeAgo: "Hace 3 días",
        severity: "Preventiva",
        status: "Activa",
      },
      {
        id: 204,
        title: "Actualización de registro",
        timeAgo: "Hace 4 días",
        severity: "Informativa",
        status: "Resuelta",
      },
    ],
  },
  {
    id: 3,
    lotName: "Lote c",
    distribution: {
      sano: 42.6,
      observacion: 33.8,
      riesgo: 23.6,
    },
    alerts: [
      {
        id: 301,
        title: "Riego restablecido correctamente",
        timeAgo: "Hace 2 días",
        severity: "Informativa",
        status: "Resuelta",
      },
      {
        id: 302,
        title: "Control sanitario realizado",
        timeAgo: "Hace 2 días",
        severity: "Informativa",
        status: "Resuelta",
      },
      {
        id: 303,
        title: "Seguimiento técnico finalizado",
        timeAgo: "Hace 4 días",
        severity: "Informativa",
        status: "Resuelta",
      },
      {
        id: 304,
        title: "Medida preventiva completada",
        timeAgo: "Hace 7 días",
        severity: "Preventiva",
        status: "Resuelta",
      },
    ],
  },
  {
    id: 4,
    lotName: "Lote d",
    distribution: {
      sano: 44.1,
      observacion: 31.4,
      riesgo: 24.5,
    },
    alerts: [
      {
        id: 401,
        title: "Falta de riego en algunas zonas",
        timeAgo: "Hace 1 día",
        severity: "Crítica",
        status: "Activa",
      },
      {
        id: 402,
        title: "Riego sugerido en bordes del cultivo",
        timeAgo: "Hace 2 días",
        severity: "Preventiva",
        status: "Activa",
      },
      {
        id: 403,
        title: "Actualización de registro completada",
        timeAgo: "Hace 3 días",
        severity: "Informativa",
        status: "Resuelta",
      },
    ],
  },
];

export function getAlertLotDotColor(lot: AlertLotItem): string {
  const totals = lot.alerts.reduce(
    (accumulator, alert) => {
      accumulator[alert.severity] += 1;
      return accumulator;
    },
    {
      Informativa: 0,
      Preventiva: 0,
      Crítica: 0,
    } as Record<AlertSeverity, number>
  );

  /**
   * En empate, priorizamos:
   * Crítica > Preventiva > Informativa
   */
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

export function useAlertsViewModel({
  onOpenDetail,
}: UseAlertsViewModelParams) {
  const [searchText, setSearchText] = useState("");

  const allAlerts = useMemo(() => {
    return ALERTS_LOTS_MOCK.flatMap((lot) => lot.alerts);
  }, []);

  const summaryCards = useMemo(() => {
    const critical = allAlerts.filter(
      (alert) => alert.severity === "Crítica"
    ).length;

    const preventive = allAlerts.filter(
      (alert) => alert.severity === "Preventiva"
    ).length;

    const informative = allAlerts.filter(
      (alert) => alert.severity === "Informativa"
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

  const filteredLots = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    return ALERTS_LOTS_MOCK.filter((lot) => {
      if (normalizedSearch.length === 0) {
        return true;
      }

      return lot.lotName.toLowerCase().includes(normalizedSearch);
    });
  }, [searchText]);

  const handleSearchChange = (text: string) => {
    setSearchText(text);
  };

  const handleOpenDetail = (lotId: number) => {
    onOpenDetail(lotId);
  };

  return {
    summaryCards,
    lots: filteredLots,
    searchText,
    handleSearchChange,
    handleOpenDetail,
  };
}