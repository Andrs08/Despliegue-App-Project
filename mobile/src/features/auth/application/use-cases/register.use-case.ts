import { IAuthRepository } from "../../domain/repositories/auth.repository.interface";

export class RegisterUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(name: string, email: string, password: string) {
    return await this.authRepository.register(name, email, password);
  }
}
