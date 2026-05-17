import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AlertRepository } from 'src/alert/domain/repositories/alert.repository';
import { Alert } from 'src/alert/domain/entities/alert.entity';
import { AlertMapper } from '../mappers/alert.mapper';

@Injectable()
export class PrismaAlertRepository implements AlertRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(alerta: Alert): Promise<Alert> {
    const created = await this.prisma.alerta.create({
      data: {
        id: alerta.id,
        lote_id: alerta.loteId,
        tipo: alerta.tipo,
        nivel: alerta.nivel,
        mensaje: alerta.mensaje,
        resuelta: false,
      },
    });
    return AlertMapper.toDomain(created);
  }

  async findAll(): Promise<Alert[]> {
    const alertas = await this.prisma.alerta.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });
    return alertas.map(AlertMapper.toDomain);
  }

  async findByLote(loteId: string): Promise<Alert[]> {
    const alertas = await this.prisma.alerta.findMany({
      where: {
        lote_id: loteId,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
    return alertas.map(AlertMapper.toDomain);
  }

  async markAsResolved(id: string): Promise<Alert> {
    const alerta = await this.prisma.alerta.update({
      where: {
        id,
      },
      data: {
        resuelta: true,
      },
    });

    return AlertMapper.toDomain(alerta);
  }
}
