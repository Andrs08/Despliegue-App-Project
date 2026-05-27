import { Module } from '@nestjs/common';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { PrismaUserRepository } from './infrastructure/persistence/prisma-user.repository';
import { RegisterUseCase } from './application/use-cases/register.use-case';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { JwtService } from './infrastructure/services/jwt.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';
import { IImageStorageService } from 'src/shared/domain/repositories/image.repository.interface';
import { AppMailerService } from './infrastructure/services/app-mailer.service';
import { SendResetCodeUseCase } from './application/use-cases/send-reset-code.use-case';
import { VerifyResetCodeUseCase } from './application/use-cases/verify-reset-code.use-case';
import { ResetPasswordUseCase } from './application/use-cases/reset-password.use-case';
import { GetProfileUseCase } from './application/use-cases/get-profile.use-case';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    PrismaModule,
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        secure: false,
        tls: {
          rejectUnauthorized: false
        },
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
      defaults: {
        from: process.env.MAIL_FROM,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    PrismaUserRepository,
    JwtService,
    AppMailerService,
    {
      provide: RegisterUseCase,
      useFactory: (repo: PrismaUserRepository) => new RegisterUseCase(repo),
      inject: [PrismaUserRepository],
    },
    {
      provide: LoginUseCase,
      useFactory: (repo: PrismaUserRepository, jwt: JwtService) =>
        new LoginUseCase(repo, jwt),
      inject: [PrismaUserRepository, JwtService],
    },
    {
      provide: UpdateUserUseCase,
      inject: [PrismaUserRepository, 'IImageStorageService'],
      useFactory: (
        repository: PrismaUserRepository,
        storage: IImageStorageService,
      ) => new UpdateUserUseCase(repository, storage),
    },
    {
      provide: SendResetCodeUseCase,
      useFactory: (repo: PrismaUserRepository, mailer: AppMailerService) =>
        new SendResetCodeUseCase(repo, mailer),
      inject: [PrismaUserRepository, AppMailerService],
    },
    {
      provide: VerifyResetCodeUseCase,
      useFactory: (repo: PrismaUserRepository) =>
        new VerifyResetCodeUseCase(repo),
      inject: [PrismaUserRepository],
    },
    {
      provide: ResetPasswordUseCase,
      useFactory: (repo: PrismaUserRepository) =>
        new ResetPasswordUseCase(repo),
      inject: [PrismaUserRepository],
    },
    {
      provide: GetProfileUseCase,
      useFactory: (repo: PrismaUserRepository) => new GetProfileUseCase(repo),
      inject: [PrismaUserRepository],
    },
  ],
})
export class AuthModule {}
