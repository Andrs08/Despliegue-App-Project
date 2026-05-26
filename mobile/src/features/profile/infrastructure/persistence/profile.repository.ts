import axios from 'axios';
import { IProfileRepository } from '../../domain/repositories/profile.repository.interface';
import { LocalPreferencesAsyncStorage } from "@/src/core/LocalPreferencesAsyncStorage";

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const SESSION_STORAGE = process.env.EXPO_PUBLIC_LOCAL_TOKEN;

export class ProfileRepository implements IProfileRepository {
    private localPreferences = LocalPreferencesAsyncStorage.getInstance();

    private async getToken(): Promise<string> {
        const token = await this.localPreferences.retrieveData<string>(SESSION_STORAGE!);
        return token ?? '';
    }

    private authHeaders(token: string) {
        return { Authorization: `Bearer ${token}` };
    }

    async getProfile(id: string): Promise<{ name: string; email: string; foto_url?: string }> {
        const token = await this.getToken();
        const response = await axios.get(`${API_URL}/auth/profile/${id}`, {
            headers: this.authHeaders(token),
        });
        return response.data;
    }

    async updateProfile(
        id: string,
        data: { name?: string; email?: string; password?: string },
        imageUri?: string | null,
    ): Promise<{ name: string; email: string; foto_url?: string }> {
        const token = await this.getToken();

        if (imageUri) {
            const formData = new FormData();
            if (data.name) formData.append('name', data.name);
            if (data.email) formData.append('email', data.email);
            if (data.password) formData.append('password', data.password);

            const filename = imageUri.split('/').pop() ?? 'photo.jpg';
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : 'image/jpeg';
            formData.append('image', { uri: imageUri, name: filename, type } as any);

            const response = await axios.patch(`${API_URL}/auth/${id}`, formData, {
                headers: { ...this.authHeaders(token), 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        }

        const response = await axios.patch(`${API_URL}/auth/${id}`, data, {
            headers: this.authHeaders(token),
        });
        return response.data;
    }

}