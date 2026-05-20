export enum LotStatus {
  HEALTHY = "healthy",
  OBSERVATION = "observation",
  RISK = "risk",
}

export const LOT_STATUS_TO_ESTADO: Record<
  LotStatus,
  import("../entities/lot.entity").EstadoLote
> = {
  [LotStatus.HEALTHY]: "Sano",
  [LotStatus.OBSERVATION]: "Observación",
  [LotStatus.RISK]: "Riesgo",
};

export const ESTADO_TO_LOT_STATUS: Record<
  import("../entities/lot.entity").EstadoLote,
  LotStatus
> = {
  Sano: LotStatus.HEALTHY,
  Observación: LotStatus.OBSERVATION,
  Riesgo: LotStatus.RISK,
};
