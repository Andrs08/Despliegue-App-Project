import { useEffect, useState } from 'react';
import { LocalPreferencesAsyncStorage } from '@/src/core/LocalPreferencesAsyncStorage';
import { ProfileRepository } from '../../infrastructure/persistence/profile.repository';
import { GetProfileUseCase } from '../../application/use-cases/get-profile.use-case';
import { AuthRepository } from '../../../auth/infrastructure/persistence/auth.repository';
import { LogoutUseCase } from '@/src/features/auth/application/use-cases/log_out.use-case'; 

const storage = LocalPreferencesAsyncStorage.getInstance();
const profileRepository = new ProfileRepository();
const getProfileUseCase = new GetProfileUseCase(profileRepository);

const authRepository = new AuthRepository();
const logoutUseCase = new LogoutUseCase(authRepository);

const USER_ID_STORAGE = process.env.EXPO_PUBLIC_LOCAL_USER_ID!;

export function useProfileViewModel() {
    const [userId, setUserId] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [fotoUrl, setFotoUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        const load = async () => {
            try {
                const id = await storage.retrieveData<string>(USER_ID_STORAGE);
                if (!id || !mounted) return;

                setUserId(id);
                const profile = await getProfileUseCase.execute(id);
                if (!mounted) return;

                setName(profile.name);
                setEmail(profile.email);
                setFotoUrl(profile.foto_url ?? null);
            } catch (err: any) {
                if (mounted)
                    setError(err.response?.data?.message ?? 'Error al cargar el perfil');
            } finally {
                if (mounted) setLoading(false);
            }
        };

        load();
        return () => { mounted = false; };
    }, []);

    const logout = async (): Promise<void> => {
        await logoutUseCase.execute();
    };

    return { userId, name, email, fotoUrl, loading, error, logout };
}