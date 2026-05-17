import { IImageStorageService } from 'src/shared/domain/repositories/image.repository.interface';
import { Note } from '../../domain/entities/note.entity';
import { INoteRepository } from '../../domain/repositories/note.repository.interface';
import { CreateNoteDto } from 'src/notes/infrastructure/dtos/create-note.dto';

export class CreateNoteUseCase {
  constructor(
    private readonly noteRepository: INoteRepository,
    private readonly fileStorage: IImageStorageService,
  ) {}

  async execute(data: CreateNoteDto, file?: any): Promise<Note> {
    let finalImageUrl = data.imagen_url || null;

    if (file) {
      finalImageUrl = await this.fileStorage.uploadImage(file, 'bitacoras');
    }
    const newNote = new Note(
      '', // El ID lo generará la DB
      data.lote_id ?? null,
      data.titulo,
      data.description,
      finalImageUrl,
      new Date(),
      data.usuario_id,
    );
    return await this.noteRepository.save(newNote);
  }
}
