import { AuthenticatedUser } from "../entities/autheticated-user.entity";

export interface IAuthRepository {
  login(email: string, password: string): Promise<AuthenticatedUser>;
  register(
    name: string,
    email: string,
    password: string,
  ): Promise<AuthenticatedUser>;
  saveSession(user: AuthenticatedUser): Promise<void>;
  sendResetCode(email: string): Promise<void>;
  verifyResetCode(email: string, code: string): Promise<void>;
  resetPassword(email: string, code: string, newPassword: string): Promise<void>;
}
