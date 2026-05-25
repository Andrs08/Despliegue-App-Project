import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { PrismaService } from '../../../prisma/prisma.service';
import { StageRecordRepository } from '../../domain/repositories/stage-recordmonitoring.repository';
import { StageRecord } from '../../domain/entities/stage-record.entity';
import { StageRecordMapper } from '../mappers/stage-record.mapper';

@Injectable()
export class PrismaStageRecordRepository implements StageRecordRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: StageRecord): Promise<StageRecord> {
    try {
      const created = await this.prisma.registro_etapa.create({
        data: {
          id: data.id,
          lote_id: data.lote_id,
          etapa_id: data.etapa_id,
          datos: data.datos,
          fecha: data.fecha,
        },
      });
      return StageRecordMapper.toDomain(created);
    } catch {
      throw new InternalServerErrorException('Error creando el registro');
    }
  }

  async findByLote(loteId: string): Promise<StageRecord[] | null> {
    const registros = await this.prisma.registro_etapa.findMany({
      where: {
        lote_id: loteId,
      },

      orderBy: {
        fecha: 'desc',
      },
    });

    if (!registros) return null;
    return registros.map(StageRecordMapper.toDomain);
  }

  async update(id: string, data: any): Promise<StageRecord | null> {
    const updated = await this.prisma.registro_etapa.update({
      where: {
        id,
      },

      data: {
        datos: data.datos,
        fecha: data.fecha,
      },
    });

    if (!updated) return null;

    return StageRecordMapper.toDomain(updated);
  }
}
