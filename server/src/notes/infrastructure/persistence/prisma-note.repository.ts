import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Note } from '../../domain/entities/note.entity';
import { INoteRepository } from '../../domain/repositories/note.repository.interface';

@Injectable()
export class PrismaNoteRepository implements INoteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(note: Note): Promise<Note> {
    const createdNote = await this.prisma.bitacora.create({
      data: {
        lote_id: note.lote_id,
        titulo: note.titulo,
        description: note.description,
        imagen_url: note.imagen_url,
        usuario_id: note.usuario_id,
        fecha: note.fecha,
      },
    });

    return this.toDomain(createdNote);
  }

  async findAllByUser(userId: string): Promise<Note[]> {
    const bitacoras = await this.prisma.bitacora.findMany({
      where: { usuario_id: userId },
    });

    return bitacoras.map(this.toDomain);
  }

  async findById(id: string): Promise<Note> {
    const bitacora = await this.prisma.bitacora.findUnique({
      where: { id: id },
    });
    return this.toDomain(bitacora);
  }

  async update(id: string, note: Partial<Note>): Promise<Note> {
    const updatedNote = await this.prisma.bitacora.update({
      where: {
        id: id,
      },
      data: {
        lote_id: note.lote_id,
        titulo: note.titulo,
        description: note.description,
        imagen_url: note.imagen_url,
        fecha: note.fecha,
        usuario_id: note.usuario_id,
      },
    });

    return this.toDomain(updatedNote);
  }

  async delete(id: string) {
    await this.prisma.bitacora.delete({
      where: {
        id: id,
      },
    });
  }

  private toDomain(prismaNote: any): Note {
    return new Note(
      prismaNote.id,
      prismaNote.lote_id,
      prismaNote.titulo,
      prismaNote.description,
      prismaNote.imagen_url,
      prismaNote.fecha,
      prismaNote.usuario_id,
      prismaNote.created_at,
    );
  }
}
