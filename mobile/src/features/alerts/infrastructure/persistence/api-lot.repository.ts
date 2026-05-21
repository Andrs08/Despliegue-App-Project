import { ILocalPreferences } from "@/src/core/iLocalPreferences";
import { Lot } from "../../domain/entities/lot.entity";
import { LotRepository } from "../../domain/repositories/lot.repository";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const SESSION_TOKEN = process.env.EXPO_PUBLIC_LOCAL_TOKEN;

interface LotApiResponse {
  id: string;
  nombre: string;
  [key: string]: unknown;
}

export class ApiLotRepository implements LotRepository {
  constructor(private readonly storage: ILocalPreferences) {}

  private async getToken(): Promise<string> {
    const token = await this.storage.retrieveData<string>(SESSION_TOKEN!);
    if (!token) throw new Error("No autenticado");
    return token;
  }

  async findByName(nombre?: string): Promise<Lot[]> {
    const token = await this.getToken();
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const query = nombre ? `?nombre=${encodeURIComponent(nombre)}` : "";
    const response = await fetch(`${BASE_URL}/lotes/filter${query}`, {
      headers,
    });

    if (!response.ok) {
      throw new Error("Error al obtener los lotes");
    }

    const data: LotApiResponse[] = await response.json();
    return data.map((raw) => new Lot(raw.id, raw.nombre));
  }
}
