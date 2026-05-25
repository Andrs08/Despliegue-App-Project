import * as bcrypt from 'bcrypt';
import { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { v4 as uuid } from 'uuid';

export class RegisterUseCase {
  constructor(private userRepo: UserRepository) {}

  async execute(data: any) {
    const existing = await this.userRepo.findByEmail(data.email);
    if (existing) throw new Error('User already exists');

    const hash = await bcrypt.hash(data.password, 10);

    const user = new User(uuid(), data.name, data.email, hash);

    return this.userRepo.create(user);
  }
}
