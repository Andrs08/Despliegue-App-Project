import { useCallback, useMemo, useState } from "react";
import { Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import type { EtapaLote } from "../../domain/entities/lot.entity";
import type { Lote } from "../../domain/entities/lot.entity";
import type { LoteAlert } from "../../domain/entities/alert.entity";

import { GetLoteUseCase } from "../../application/use-cases/get-lot.use-case";
import { DeleteLoteUseCase } from "../../application/use-cases/delete-lots.use-case";
import { GetLoteAlertsUseCase } from "../../application/use-cases/get-lot-alerts.use-case";

import { ApiLoteRepository } from "../../infrastructure/persistence/api_lot.repository";
import { ApiAlertRepository } from "../../infrastructure/persistence/api_alert.repository";
import { LocalPreferencesAsyncStorage } from "../../../../core/LocalPreferencesAsyncStorage";

const storage = LocalPreferencesAsyncStorage.getInstance();
const loteRepo = new ApiLoteRepository(storage);
const alertRepo = new ApiAlertRepository(storage);

const getLoteUseCase = new GetLoteUseCase(loteRepo);
const deleteLoteUseCase = new DeleteLoteUseCase(loteRepo);
const getLoteAlertsUseCase = new GetLoteAlertsUseCase(alertRepo);

export type LoteStageProgressItem = {
  key: EtapaLote;
  label: string;
  shortLabel: string;
  icon: string;
};

export const ID_TO_ETAPA: Record<number, EtapaLote> = {
  1: "preparacion_suelo",
  2: "siembra",
  3: "desarrollo_vegetativo",
  4: "floracion",
  5: "fructificacion",
  6: "cosecha",
};

const ETAPA_ORDER: EtapaLote[] = [
  "preparacion_suelo",
  "siembra",
  "desarrollo_vegetativo",
  "floracion",
  "fructificacion",
  "cosecha",
];

const ETAPA_LABELS: Record<EtapaLote, string> = {
  preparacion_suelo: "Preparación del suelo",
  siembra: "Siembra",
  desarrollo_vegetativo: "Desarrollo vegetativo",
  floracion: "Floración",
  fructificacion: "Fructificación",
  cosecha: "Cosecha",
};

export const LOTE_STAGES: LoteStageProgressItem[] = [
  {
    key: "preparacion_suelo",
    label: "Preparación del suelo",
    shortLabel: "Prep.",
    icon: "leaf-outline",
  },
  {
    key: "siembra",
    label: "Siembra",
    shortLabel: "Siembra",
    icon: "flower-outline",
  },
  {
    key: "desarrollo_vegetativo",
    label: "Desarrollo vegetativo",
    shortLabel: "Desarrollo",
    icon: "trending-up-outline",
  },
  {
    key: "floracion",
    label: "Floración",
    shortLabel: "Floración",
    icon: "flower",
  },
  {
    key: "fructificacion",
    label: "Fructificación",
    shortLabel: "Fructificación",
    icon: "nutrition-outline",
  },
  {
    key: "cosecha",
    label: "Cosecha",
    shortLabel: "Cosecha",
    icon: "basket-outline",
  },
];

export type AlertDisplayItem = {
  id: string;
  title: string; 
  timeAgo: string; 
};

function calculateDaysSinceStart(fechaInicio: string): number {
  const startDate = new Date(fechaInicio);
  if (Number.isNaN(startDate.getTime())) return 0;
  const diff = new Date().getTime() - startDate.getTime();
  return Math.max(Math.floor(diff / (1000 * 60 * 60 * 24)), 0);
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffDays >= 1) return `Hace ${diffDays} día${diffDays > 1 ? "s" : ""}`;
  if (diffHours >= 1)
    return `Hace ${diffHours} hora${diffHours > 1 ? "s" : ""}`;
  if (diffMinutes >= 1)
    return `Hace ${diffMinutes} minuto${diffMinutes > 1 ? "s" : ""}`;
  return "Hace un momento";
}

function toDisplayAlert(alert: LoteAlert): AlertDisplayItem {
  return {
    id: alert.id,
    title: alert.mensaje,
    timeAgo: formatTimeAgo(alert.createdAt),
  };
}

type UseDetailLoteViewModelParams = {
  loteId: string;
  onEditLote: (loteId: string) => void;
  onRegisterData: (loteId: string) => void;
  onDeleted: () => void;
};

export function useDetailLoteViewModel({
  loteId,
  onEditLote,
  onRegisterData,
  onDeleted,
}: UseDetailLoteViewModelParams) {
  const [lote, setLote] = useState<Lote | null>(null);
  const [alerts, setAlerts] = useState<AlertDisplayItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      const load = async () => {
        setLoading(true);
        setError(null);

        try {
          // Las dos llamadas en paralelo
          const [fetchedLote, fetchedAlerts] = await Promise.all([
            getLoteUseCase.execute(loteId),
            getLoteAlertsUseCase.execute(loteId),
          ]);

          if (cancelled) return;

          setLote(fetchedLote);
          setAlerts(fetchedAlerts.map(toDisplayAlert));
        } catch (e: any) {
          if (!cancelled) {
            setError(e?.message ?? "Error cargando el lote");
          }
        } finally {
          if (!cancelled) setLoading(false);
        }
      };

      load();

      return () => {
        cancelled = true;
      };
    }, [loteId]),
  );

  const currentEtapa: EtapaLote | null = lote
    ? (ID_TO_ETAPA[lote.etapaActualId] ?? null)
    : null;

  const currentStageIndex = useMemo(() => {
    if (!currentEtapa) return -1;
    return ETAPA_ORDER.indexOf(currentEtapa);
  }, [currentEtapa]);

  const currentStageLabel = currentEtapa ? ETAPA_LABELS[currentEtapa] : "";
  const produccionEstimada = lote ? lote.numeroPlantas * 25 : 0;
  const daysSinceStart = lote ? calculateDaysSinceStart(lote.fechaInicio) : 0;

  const handleToggleOptionsMenu = () => {
    setShowOptionsMenu((v) => !v);
  };

  const handleEditLote = () => {
    setShowOptionsMenu(false);
    onEditLote(loteId);
  };

  const handleRegisterData = () => {
    onRegisterData(loteId);
  };

  const handleDeleteLote = () => {
    setShowOptionsMenu(false);

    Alert.alert(
      "Eliminar lote",
      "¿Estás seguro de que deseas eliminar este lote?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteLoteUseCase.execute(loteId);
              onDeleted();
            } catch (e: any) {
              Alert.alert("Error", e?.message ?? "No se pudo eliminar el lote");
            }
          },
        },
      ],
    );
  };

  return {
    lote,
    loading,
    error,
    produccionEstimada,
    stages: LOTE_STAGES,
    alerts,
    showOptionsMenu,
    currentStageIndex,
    currentStageLabel,
    daysSinceStart,
    handleToggleOptionsMenu,
    handleEditLote,
    handleDeleteLote,
    handleRegisterData,
  };
}