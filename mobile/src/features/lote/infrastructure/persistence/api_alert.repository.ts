import type { ILocalPreferences } from "../../../../core/iLocalPreferences";
import type { AlertRepository } from "../../domain/repositories/alert.repository";
import { LoteAlert } from "../../domain/entities/alert.entity";

type AlertApiResponse = {
  id: string;
  loteId: string;
  tipo: string;
  nivel: string;
  mensaje: string;
  resuelta: boolean;
  createdAt: string;
};

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const SESSION_TOKEN = process.env.EXPO_PUBLIC_LOCAL_TOKEN;

function toDomain(raw: AlertApiResponse): LoteAlert {
  return new LoteAlert(
    raw.id,
    raw.loteId,
    raw.tipo,
    raw.nivel,
    raw.mensaje,
    raw.resuelta,
    new Date(raw.createdAt),
  );
}

export class ApiAlertRepository implements AlertRepository {
  constructor(private readonly storage: ILocalPreferences) {}

  private async getToken(): Promise<string> {
    const token = await this.storage.retrieveData<string>(SESSION_TOKEN!);
    if (!token) throw new Error("No autenticado");
    return token;
  }

  private async apiFetch<T>(path: string): Promise<T> {
    const token = await this.getToken();
    const response = await fetch(`${BASE_URL}${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`API error ${response.status} en ${path}: ${body}`);
    }

    return response.json() as Promise<T>;
  }

  async findByLoteId(loteId: string, limit = 3): Promise<LoteAlert[]> {
    const params = new URLSearchParams({
      limit: String(limit),
      resuelta: "false",
    });

    const data = await this.apiFetch<AlertApiResponse[]>(
      `/alerts/lot/${loteId}?${params.toString()}`,
    );

    return data
      .map(toDomain)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }
}
