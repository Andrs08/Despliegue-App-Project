import { IProfileRepository } from "../../domain/repositories/profile.repository.interface";

export class GetProfileUseCase {
  constructor(private readonly profileRepository: IProfileRepository) {}
  async execute(id: string): Promise<{ name: string; email: string; foto_url?: string }> {
    return this.profileRepository.getProfile(id);
  }
}








  