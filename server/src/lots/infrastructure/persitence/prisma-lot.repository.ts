import { LoteRepository } from '../../domain/repositories/lot.repository';
import { PrismaService } from '../../../prisma/prisma.service';
import { Lot } from '../../domain/entities/lot.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaLoteRepository implements LoteRepository {
  constructor(private readonly prisma: PrismaService) {} 
  async create(lote: Lot): Promise<Lot> {
    const created = await this.prisma.lote.create({
      data: {
        id: lote.id,
        usuario_id: lote.usuario_id,
        nombre: lote.nombre,
        hectareas: lote.hectareas,
        temperatura_min: lote.temperatura_min,
        temperatura_max: lote.temperatura_max,
        etapa_actual_id: lote.etapa_actual_id,
        fecha_inicio: lote.fecha_inicio,
        numero_plantas: lote.numero_plantas,
      },
    });

    return this.toDomain(created);
  }

  async findById(id: string): Promise<Lot | null> {
    const lote = await this.prisma.lote.findUnique({
      where: { id },
    });

    if (!lote) {
      return null;
    }
    return this.toDomain(lote);
  }

  async findAllByUser(userId: string): Promise<Lot[]> {
    const lotes = await this.prisma.lote.findMany({
      where: { usuario_id: userId },
    });

    return lotes.map(this.toDomain);
  }

  async update(id: string, data: Partial<Lot>): Promise<Lot> {
    const updated = await this.prisma.lote.update({
      where: { id },
      data,
    });

    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.lote.delete({
      where: { id },
    });
  }

  private toDomain(lote: any): Lot {
    return new Lot(
      lote.id,
      lote.usuario_id,
      lote.nombre,
      lote.hectareas,
      lote.temperatura_min,
      lote.temperatura_max,
      lote.etapa_actual,
      lote.fecha_inicio,
      lote.numero_plantas,
    );
  }
}
