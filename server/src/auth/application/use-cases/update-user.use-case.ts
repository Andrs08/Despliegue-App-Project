import { NotFoundException } from '@nestjs/common';
import { User } from 'src/auth/domain/entities/user.entity';
import { UserRepository } from 'src/auth/domain/repositories/user.repository';
import { UpdateUserDto } from 'src/auth/infrastructure/dtos/update-user.dto';
import { IImageStorageService } from 'src/shared/domain/repositories/image.repository.interface';
import * as bcrypt from 'bcrypt';

export class UpdateUserUseCase {
  constructor(
    private userRepo: UserRepository,
    private fileStorage: IImageStorageService,
  ) {}
  async execute(id: string, data: UpdateUserDto, file: any): Promise<User> {
    const existing = await this.userRepo.findById(id);
    if (!existing) {
      throw new NotFoundException('El usuario no existe');
    }

    let finalImageUrl = data.foto_url || null;
    if (file) {
      if (existing.foto_url) {
        await this.fileStorage.deleteImage(existing.foto_url!);
      }
      finalImageUrl = await this.fileStorage.uploadImage(file, 'usuarios');
    }

    const password = await bcrypt.hash(data.password, 10);

    const updatedUser: Partial<User> = {
      name: data.name,
      email: data.email,
      passwordHash: password,
      foto_url: finalImageUrl ?? undefined,
    };
    return await this.userRepo.update(id, updatedUser);
  }
}
