import type { Lote, EstadoLote } from "../../domain/entities/lot.entity";
import type {
  LoteRepository,
  CreateLoteInput,
  UpdateLoteInput,
  FilterLotesInput,
} from "../../domain/repositories/lot.repository";
import { ESTADO_TO_LOT_STATUS } from "../../domain/enums/lot.enum";
import { ILocalPreferences } from "../../../../core/iLocalPreferences";

type LoteApiResponse = {
  id: string;
  usuario_id: string;
  nombre: string;
  hectareas: number;
  temperatura_min: number;
  temperatura_max: number;
  etapa_actual_id: number;
  fecha_inicio: string;
  numero_plantas: number;
  estado?: EstadoLote;
};

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const SESSION_TOKEN = process.env.EXPO_PUBLIC_LOCAL_TOKEN;

function toDomain(raw: LoteApiResponse): Lote {
  const { Lote } = require("../../domain/entities/lot.entity");

  const estado: EstadoLote = raw.estado ?? "Sano";
  const fechaInicio =
    typeof raw.fecha_inicio === "string"
      ? raw.fecha_inicio.split("T")[0]
      : new Date(raw.fecha_inicio).toISOString().split("T")[0];
  return new Lote(
    raw.id,
    raw.usuario_id,
    raw.nombre,
    raw.hectareas,
    raw.temperatura_min,
    raw.temperatura_max,
    raw.etapa_actual_id,
    fechaInicio,
    raw.numero_plantas,
    estado,
  );
}

export class ApiLoteRepository implements LoteRepository {
  constructor(private storage: ILocalPreferences) {}

  private async getAuthToken(): Promise<string> {
    const token = await this.storage.retrieveData<string>(SESSION_TOKEN!);
    if (!token) throw new Error("No autenticado");
    return token;
  }

  private async apiFetch<T>(
    path: string,
    options: RequestInit = {},
  ): Promise<T> {
    const token = await this.getAuthToken();

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

  async findAllByUser(): Promise<Lote[]> {
    const data = await this.apiFetch<LoteApiResponse[]>("/lotes");
    return data.map(toDomain);
  }

  async findById(id: string): Promise<Lote | null> {
    try {
      const data = await this.apiFetch<LoteApiResponse>(`/lotes/${id}`);
      return toDomain(data);
    } catch {
      return null;
    }
  }

  async findWithFilters(filters: FilterLotesInput): Promise<Lote[]> {
    const params = new URLSearchParams();

    if (filters.estado) {
      const backendStatus = ESTADO_TO_LOT_STATUS[filters.estado];
      if (backendStatus) params.set("estado", backendStatus);
    }

    if (filters.nombre) {
      params.set("nombre", filters.nombre.trim());
    }

    const query = params.toString() ? `?${params.toString()}` : "";
    const data = await this.apiFetch<LoteApiResponse[]>(
      `/lotes/filter${query}`,
    );
    return data.map(toDomain);
  }

  async create(input: CreateLoteInput): Promise<Lote> {
    const response = await this.apiFetch<{ lote: LoteApiResponse }>("/lotes", {
      method: "POST",
      body: JSON.stringify(input),
    });
    return toDomain(response.lote ?? (response as unknown as LoteApiResponse));
  }

  async update(id: string, input: UpdateLoteInput): Promise<Lote> {
    const data = await this.apiFetch<LoteApiResponse>(`/lotes/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    });
    return toDomain(data);
  }

  async delete(id: string): Promise<void> {
    await this.apiFetch<void>(`/lotes/${id}`, { method: "DELETE" });
  }
}
