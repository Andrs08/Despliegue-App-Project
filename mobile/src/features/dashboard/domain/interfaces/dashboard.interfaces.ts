export interface GeneralSummary {
  total_lotes: number;
  total_hectareas: number;
  total_plantas: number;
  alertas_activas: number;
  lotes_riesgo: number;
}

export interface LotStatus {
  riesgo: number;
  observacion: number;
  sanos: number;
}

export interface StageDistribution {
  etapa_actual_id: number | null;
  _count: number;
}

export interface AlertsByLevel {
  nivel: string | null;
  _count: number;
}

export interface ActiveAlerts {
  total: number;
  niveles: AlertsByLevel[];
}

export interface Production {
  lote_id: string;
  lote_nombre: string | null;
  produccion_estimada: number;
  produccion_real: number | null;
}

export interface DashboardData {
  summary: GeneralSummary;
  lotStatus: LotStatus;
  stageDistribution: StageDistribution[];
  activeAlerts: ActiveAlerts;
  production: Production[];
}
