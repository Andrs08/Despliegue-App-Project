import { IProfileRepository } from "../../domain/repositories/profile.repository.interface";
 
export class UpdateProfileUseCase {
  constructor(private readonly profileRepository: IProfileRepository) {} 
  async execute(
    id: string,
    data: { name?: string; email?: string; password?: string },
    imageUri?: string | null,
  ): Promise<{ name: string; email: string; foto_url?: string }> {
    return this.profileRepository.updateProfile(id, data, imageUri);
  }
} 