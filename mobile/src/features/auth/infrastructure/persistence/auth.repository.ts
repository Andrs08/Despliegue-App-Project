import { LocalPreferencesAsyncStorage } from "@/src/core/LocalPreferencesAsyncStorage";
import { IAuthRepository } from "../../domain/repositories/auth.repository.interface";
import { AuthenticatedUser } from "../../domain/entities/autheticated-user-entity";
import axios from "axios";

const API_URL = "http://192.168.1.5:3000/auth";
const SESSION_KEY = "user_session";

export class AuthRepository implements IAuthRepository {
  private localPreferences = LocalPreferencesAsyncStorage.getInstance();

  async login(email: string, password: string): Promise<AuthenticatedUser> {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  }

  async saveSession(user: AuthenticatedUser): Promise<void> {
    await this.localPreferences.storeData(SESSION_KEY, user.token);
  }
}
