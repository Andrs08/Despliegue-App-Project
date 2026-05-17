import { UpdateNoteDto } from 'src/notes/infrastructure/dtos/update-note.dto';
import { Note } from '../../domain/entities/note.entity';
import { INoteRepository } from '../../domain/repositories/note.repository.interface';
import { IImageStorageService } from 'src/shared/domain/repositories/image.repository.interface';
import { NotFoundException } from '@nestjs/common';

export class UpdateNoteUseCase {
  constructor(
    private readonly noteRepository: INoteRepository,
    private readonly fileStorage: IImageStorageService,
  ) {}
  async execute(id: string, data: UpdateNoteDto, file?: any): Promise<Note> {
    const existingNote = await this.noteRepository.findById(id);
    if (!existingNote) {
      throw new NotFoundException('La bitácora no existe');
    }
    let finalImageUrl = data.imagen_url || null;

    if (file) {
      if (existingNote.imagen_url) {
        await this.fileStorage.deleteImage(existingNote.imagen_url);
      }

      finalImageUrl = await this.fileStorage.uploadImage(file, 'bitacoras');
    }
    const updatedNote: Partial<Note> = {
      lote_id: data.lote_id,
      titulo: data.titulo,
      description: data.description,
      imagen_url: finalImageUrl,
      fecha: data.fecha,
      usuario_id: data.usuario_id,
    };
    return await this.noteRepository.update(id, updatedNote);
  }
}
