import { BadRequestException } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';

export class VerifyResetCodeUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(email: string, code: string): Promise<void> {
    const record = await this.userRepo.findResetCode(email);

    if (!record) {
      throw new BadRequestException('Código no encontrado o ya utilizado');
    }

    if (new Date() > record.expires_at) {
      await this.userRepo.clearResetCode(email);
      throw new BadRequestException(
        'El código ha expirado. Solicita uno nuevo.',
      );
    }

    if (record.code !== code) {
      throw new BadRequestException('Código incorrecto');
    }
  }
}