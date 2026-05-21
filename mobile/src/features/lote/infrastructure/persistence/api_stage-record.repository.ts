import type { ILocalPreferences } from "../../../../core/iLocalPreferences";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const SESSION_TOKEN = process.env.EXPO_PUBLIC_LOCAL_TOKEN;

export type CreateStageRecordInput = {
  lote_id: string;
  etapa_id: number;
  datos: Record<string, number>;
  fecha: string; // ISO date string
};

export type StageRecordApiResponse = {
  registro: {
    id: string;
    lote_id: string;
    etapa_id: number;
    datos: Record<string, number>;
    fecha: string;
    created_at?: string;
  };
  alerta: unknown[] | null;
};

export class ApiStageRecordRepository {
  constructor(private readonly storage: ILocalPreferences) {}

  private async getToken(): Promise<string> {
    const token = await this.storage.retrieveData<string>(SESSION_TOKEN!);
    if (!token) throw new Error("No autenticado");
    return token;
  }

  private async apiFetch<T>(
    path: string,
    options: RequestInit = {},
  ): Promise<T> {
    const token = await this.getToken();

    const response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers ?? {}),
      },
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`API error ${response.status} en ${path}: ${body}`);
    }

    if (response.status === 204) return undefined as T;

    return response.json() as Promise<T>;
  }

  async create(input: CreateStageRecordInput): Promise<StageRecordApiResponse> {
    return this.apiFetch<StageRecordApiResponse>("/stage-records", {
      method: "POST",
      body: JSON.stringify({
        lote_id: input.lote_id,
        etapa_id: input.etapa_id,
        datos: input.datos,
        fecha: new Date(input.fecha).toISOString(),
      }),
    });
  }
}
