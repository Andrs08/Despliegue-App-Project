import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../../domain/repositories/user.repository';

export class ResetPasswordUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(
    email: string,
    code: string,
    newPassword: string,
  ): Promise<void> {
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

    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await this.userRepo.update(user.id, { passwordHash });
    await this.userRepo.clearResetCode(email);
  }
}