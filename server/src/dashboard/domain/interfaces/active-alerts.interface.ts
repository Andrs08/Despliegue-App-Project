export interface AlertsByLevel {
  nivel: string | null;
  _count:number;
}

export interface ActiveAlerts {
  total: number;
  niveles: AlertsByLevel[];
}
