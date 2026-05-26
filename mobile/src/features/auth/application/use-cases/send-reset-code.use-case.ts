import { IAuthRepository } from '../../domain/repositories/auth.repository.interface';
 
export class SendResetCodeUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}
  async execute(email: string): Promise<void> {
    await this.authRepository.sendResetCode(email);
  }
}
 
export class VerifyResetCodeUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}
  async execute(email: string, code: string): Promise<void> {
    await this.authRepository.verifyResetCode(email, code);
  }
}
 
export class ResetPasswordUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}
  async execute(email: string, code: string, newPassword: string): Promise<void> {
    await this.authRepository.resetPassword(email, code, newPassword);
  }
}