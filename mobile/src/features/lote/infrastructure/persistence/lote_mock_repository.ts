import type {
  EstadoLote,
  EtapaLote,
  LoteRouteItem,
} from "../../../../core/navigation/app_navigator";

export type LoteInput = {
  nombre: string;
  hectareas: number;
  temperaturaMinima: number;
  temperaturaMaxima: number;
  etapa: EtapaLote;
  fechaInicio: string;
  numeroPlantas: number;
  estado?: EstadoLote;
  produccionEstimada?: number;
};

let LOTES_DATA: LoteRouteItem[] = [
  {
    id: 1,
    nombre: "Lote a",
    hectareas: 10,
    temperaturaMinima: 24,
    temperaturaMaxima: 32,
    etapa: "cosecha",
    fechaInicio: "2026-02-21",
    numeroPlantas: 1800,
    estado: "Sano",
    produccionEstimada: 1800,
  },
  {
    id: 2,
    nombre: "Lote b",
    hectareas: 8,
    temperaturaMinima: 23,
    temperaturaMaxima: 31,
    etapa: "desarrollo_vegetativo",
    fechaInicio: "2026-03-03",
    numeroPlantas: 1300,
    estado: "Observación",
    produccionEstimada: 1200,
  },
  {
    id: 3,
    nombre: "Lote c",
    hectareas: 6,
    temperaturaMinima: 22,
    temperaturaMaxima: 30,
    etapa: "floracion",
    fechaInicio: "2026-03-18",
    numeroPlantas: 900,
    estado: "Riesgo",
    produccionEstimada: 850,
  },
];

export function getLotes(): LoteRouteItem[] {
  return [...LOTES_DATA];
}

export function getLoteById(id: number): LoteRouteItem | null {
  return LOTES_DATA.find((lote) => lote.id === id) ?? null;
}

export function createLote(input: LoteInput): LoteRouteItem {
  const newLote: LoteRouteItem = {
    id: Date.now(),
    nombre: input.nombre,
    hectareas: input.hectareas,
    temperaturaMinima: input.temperaturaMinima,
    temperaturaMaxima: input.temperaturaMaxima,
    etapa: input.etapa,
    fechaInicio: input.fechaInicio,
    numeroPlantas: input.numeroPlantas,
    estado: input.estado ?? "Sano",
    produccionEstimada:
      input.produccionEstimada ?? Math.round(input.numeroPlantas),
  };

  LOTES_DATA = [newLote, ...LOTES_DATA];

  return newLote;
}

export function updateLote(id: number, input: LoteInput): LoteRouteItem | null {
  const index = LOTES_DATA.findIndex((lote) => lote.id === id);

  if (index === -1) {
    return null;
  }

  const updatedLote: LoteRouteItem = {
    ...LOTES_DATA[index],
    nombre: input.nombre,
    hectareas: input.hectareas,
    temperaturaMinima: input.temperaturaMinima,
    temperaturaMaxima: input.temperaturaMaxima,
    etapa: input.etapa,
    fechaInicio: input.fechaInicio,
    numeroPlantas: input.numeroPlantas,
    estado: input.estado ?? LOTES_DATA[index].estado,
    produccionEstimada:
      input.produccionEstimada ?? LOTES_DATA[index].produccionEstimada,
  };

  LOTES_DATA[index] = updatedLote;

  return updatedLote;
}

export function deleteLote(id: number): void {
  LOTES_DATA = LOTES_DATA.filter((lote) => lote.id !== id);
}

export function getEtapaLabel(etapa: EtapaLote): string {
  const labels: Record<EtapaLote, string> = {
    preparacion_suelo: "Preparación del suelo",
    siembra: "Siembra",
    desarrollo_vegetativo: "Desarrollo vegetativo",
    floracion: "Floración",
    fructificacion: "Fructificación",
    cosecha: "Cosecha",
  };

  return labels[etapa];
}

export function getEtapaIndex(etapa: EtapaLote): number {
  const order: EtapaLote[] = [
    "preparacion_suelo",
    "siembra",
    "desarrollo_vegetativo",
    "floracion",
    "fructificacion",
    "cosecha",
  ];

  return order.indexOf(etapa);
}