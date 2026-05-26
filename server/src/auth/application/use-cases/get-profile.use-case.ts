import { NotFoundException } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';

export class GetProfileUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(id: string): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.userRepo.findById(id);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      foto_url: user.foto_url,
    };
  }
}