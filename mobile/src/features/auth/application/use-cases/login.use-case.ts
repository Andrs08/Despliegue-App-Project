import { AuthenticatedUser } from "../../domain/entities/autheticated-user-entity";
import { IAuthRepository } from "../../domain/repositories/auth.repository.interface";

export class LoginUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(email: string, password: string): Promise<AuthenticatedUser> {
    const authenticatedUser = await this.authRepository.login(email, password);
    await this.authRepository.saveSession(authenticatedUser);
    return authenticatedUser;
  }
}
