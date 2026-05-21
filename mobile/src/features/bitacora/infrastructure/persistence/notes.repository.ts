import { LocalPreferencesAsyncStorage } from "@/src/core/LocalPreferencesAsyncStorage";
import { Note } from "../../domain/interfaces/note.interface";
import { INotesRepository } from "../../domain/repositories/notes.repository.interface";
import axios from "axios";
import { mapServerToNavigationItem } from "../mappers/notes.mapper";
import { BitacoraRouteItem } from "@/src/core/navigation/app_navigator";

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const SESSION_STORAGE = process.env.EXPO_PUBLIC_LOCAL_TOKEN;
const USER_ID_STORAGE = process.env.EXPO_PUBLIC_LOCAL_USER_ID;

export class NoteRepository implements INotesRepository {
  private localPreferences = LocalPreferencesAsyncStorage.getInstance();

  async create(
    title: string,
    description: string,
    lotId: string | null,
    imageUri: string | null,
  ): Promise<void> {
    const token = await this.localPreferences.retrieveData(SESSION_STORAGE!);
    const formData = new FormData();
    formData.append("titulo", title);
    formData.append("description", description);

    if (lotId) {
      formData.append("lote_id", lotId);
    }

    if (imageUri) {
      const filename = imageUri.split("/").pop() || "image.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      formData.append("image", {
        uri: imageUri,
        name: filename,
        type,
      } as any);
    }

    await axios.post(`${API_URL}/notes`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
  }

  async findAllByUser(): Promise<BitacoraRouteItem[]> {
    const token = await this.localPreferences.retrieveData(SESSION_STORAGE!);

    const response = await axios.get(`${API_URL}/notes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const cleanData = response.data.map((item: Note) =>
      mapServerToNavigationItem(item),
    );
    return cleanData;
  }

  async update(
    id: string,
    title: string,
    description: string,
    imageUri: string | null,
  ): Promise<void> {
    const token = await this.localPreferences.retrieveData(SESSION_STORAGE!);
    const userId = await this.localPreferences.retrieveData(USER_ID_STORAGE!);
    const formData = new FormData();
    formData.append("usuario_id", String(userId));
    formData.append("titulo", title);
    formData.append("description", description);

    if (imageUri) {
      const filename = imageUri.split("/").pop() || "image.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      formData.append("image", {
        uri: imageUri,
        name: filename,
        type,
      } as any);
    }

    await axios.patch(`${API_URL}/notes/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
  }

  async delete(id: string): Promise<void> {
    const token = await this.localPreferences.retrieveData(SESSION_STORAGE!);
    await axios.delete(`${API_URL}/notes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
