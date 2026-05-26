export interface IProfileRepository {

    getProfile(id: string): Promise<{ name: string; email: string; foto_url?: string }>;
    updateProfile(
        id: string,
        data: { name?: string; email?: string; password?: string },
        imageUri?: string | null,
    ): Promise<{ name: string; email: string; foto_url?: string }>

}