import * as bcrypt from 'bcrypt';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UnauthorizedException } from '@nestjs/common';

export class LoginUseCase {
  constructor(
    private userRepo: UserRepository,
    private jwtService: any,
  ) {}

  async execute(data: any) {
    const user = await this.userRepo.findByEmail(data.email);

    if (!user)
      throw new UnauthorizedException(
        'El correo electrónico o la contraseña son incorrectos',
      );

    const match = await bcrypt.compare(data.password, user.passwordHash);

    if (!match)
      throw new UnauthorizedException(
        'El correo electrónico o la contraseña son incorrectos',
      );

    const token = this.jwtService.generateToken({
      userId: user.id,
      email: user.email,
    });

    return { token };
  }
}
