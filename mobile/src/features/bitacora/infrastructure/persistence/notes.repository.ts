import { LocalPreferencesAsyncStorage } from "@/src/core/LocalPreferencesAsyncStorage";
import { Note } from "../../domain/interfaces/note.interface";
import { INotesRepository } from "../../domain/repositories/notes.repository.interface";
import axios from "axios";
import { mapServerToNavigationItem } from "../mappers/notes.mapper";
import { BitacoraRouteItem } from "@/src/core/navigation/app_navigator";

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const SESSION_STORAGE = process.env.EXPO_PUBLIC_LOCAL_TOKEN;

export class NoteRepository implements INotesRepository {
  private localPreferences = LocalPreferencesAsyncStorage.getInstance();

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
}
