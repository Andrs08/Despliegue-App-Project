import { Module } from '@nestjs/common';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { PrismaUserRepository } from './infrastructure/persistence/prisma-user.repository';
import { RegisterUseCase } from './application/use-cases/register.use-case';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { JwtService } from './infrastructure/services/jwt.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';
import { IImageStorageService } from 'src/shared/domain/repositories/image.repository.interface';

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [
    PrismaUserRepository,
    JwtService,
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
  ],
})
export class AuthModule {}
