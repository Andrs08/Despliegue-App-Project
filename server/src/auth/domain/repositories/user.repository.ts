import { User } from '../entities/user.entity';

export abstract class UserRepository {
  abstract findByEmail(email: string): Promise<User | null>;
  abstract create(user: User): Promise<User>;
  abstract findById(id: string): Promise<User | null>;
  abstract update(id: string, user: Partial<User>): Promise<User>;
  abstract saveResetCode(
    email: string,
    code: string,
    expires_at: Date,
  ): Promise<void>;
  abstract findResetCode(
    email: string,
  ): Promise<{ code: string; expires_at: Date } | null>;
  abstract clearResetCode(email: string): Promise<void>;
}