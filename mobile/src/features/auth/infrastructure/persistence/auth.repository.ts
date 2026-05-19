import { LocalPreferencesAsyncStorage } from "@/src/core/LocalPreferencesAsyncStorage";
import { IAuthRepository } from "../../domain/repositories/auth.repository.interface";
import { AuthenticatedUser } from "../../domain/entities/autheticated-user.entity";
import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const SESSION_STORAGE = process.env.EXPO_PUBLIC_LOCAL_TOKEN;
const USER_ID_STORAGE = process.env.EXPO_PUBLIC_LOCAL_USER_ID;
const USER_NAME_STORAGE = process.env.EXPO_PUBLIC_LOCAL_USER_NAME;

export class AuthRepository implements IAuthRepository {
  private localPreferences = LocalPreferencesAsyncStorage.getInstance();

  async login(email: string, password: string): Promise<AuthenticatedUser> {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    return response.data;
  }

  async saveSession(user: AuthenticatedUser): Promise<void> {
    await this.localPreferences.storeData(SESSION_STORAGE!, user.token);
    await this.localPreferences.storeData(USER_ID_STORAGE!, user.id);
    await this.localPreferences.storeData(USER_NAME_STORAGE!, user.name);
  }

  async register(
    name: string,
    email: string,
    password: string,
  ): Promise<AuthenticatedUser> {
    const response = await axios.post(`${API_URL}/auth/register`, {
      name,
      email,
      password,
    });
    return response.data;
  }
}
