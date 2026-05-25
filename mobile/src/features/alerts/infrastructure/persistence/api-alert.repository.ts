import { Alert, AlertNivel } from "../../domain/entities/alert.entity";
import { AlertRepository } from "../../domain/repositories/alert.repository";
import type { ILocalPreferences } from "../../../../core/iLocalPreferences";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const SESSION_TOKEN = process.env.EXPO_PUBLIC_LOCAL_TOKEN;

interface AlertApiResponse {
  id: string;
  lote_id: string;
  tipo: string;
  nivel: string;
  mensaje: string;
  resuelta: boolean;
  created_at?: string;
}

function toDomain(raw: AlertApiResponse): Alert {
  return new Alert(
    raw.id,
    raw.lote_id,
    raw.tipo,
    raw.nivel as AlertNivel,
    raw.mensaje,
    raw.resuelta,
    raw.created_at ? new Date(raw.created_at) : undefined,
  );
}

export class ApiAlertRepository implements AlertRepository {
  constructor(private readonly storage: ILocalPreferences) {}

  private async getToken(): Promise<string> {
    const token = await this.storage.retrieveData<string>(SESSION_TOKEN!);
    if (!token) throw new Error("No autenticado");
    return token;
  }

  async findAll(): Promise<Alert[]> {
    const token = await this.getToken();
    const response = await fetch(`${BASE_URL}/alerts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener las alertas");
    }

    const data: AlertApiResponse[] = await response.json();
    return data.map(toDomain);
  }

  async findByLote(loteId: string): Promise<Alert[]> {
    const token = await this.getToken();
    const response = await fetch(`${BASE_URL}/alerts/lot/${loteId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener las alertas del lote");
    }

    const data: AlertApiResponse[] = await response.json();
    return data.map(toDomain);
  }

  async markAsResolved(id: string): Promise<Alert> {
    const token = await this.getToken();
    const response = await fetch(`${BASE_URL}/alerts/${id}/read`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al marcar la alerta como resuelta");
    }

    const data: AlertApiResponse = await response.json();
    return toDomain(data);
  }
}
