export interface Production {
  lote_id: string;
  lote_nombre: string | null;
  produccion_estimada: number;
  produccion_real: number | null;
}
