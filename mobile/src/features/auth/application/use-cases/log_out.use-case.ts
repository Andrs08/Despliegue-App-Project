import { IAuthRepository } from "../../domain/repositories/auth.repository.interface";
 
export class LogoutUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}
 
  async execute(): Promise<void> {
    await this.authRepository.clearSession();
  }
}