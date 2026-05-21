import { LoteRepository } from '../../domain/repositories/lot.repository';
import { PrismaService } from '../../../prisma/prisma.service';
import { Lot } from '../../domain/entities/lot.entity';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { LotStatus } from 'src/lots/domain/interfaces/lot-status.enum';
import { FilterLotsDTO } from '../dtos/filter-lot-by-status.dto';

@Injectable()
export class PrismaLoteRepository implements LoteRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(lote: Lot): Promise<Lot> {
    try {
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
    } catch {
      throw new InternalServerErrorException('Error creando lote');
    }
  }

  async findById(id: string): Promise<Lot | null> {
    const lote = await this.prisma.lote.findUnique({
      where: { id },
      include: { alerta: true },
    });

    if (!lote) {
      return null;
    }
    return this.toDomain(lote);
  }

  async findAllByUser(userId: string): Promise<Lot[] | null> {
    const lotes = await this.prisma.lote.findMany({
      where: { usuario_id: userId },
    });
    if (!lotes) {
      return null;
    }

    return lotes.map(this.toDomain);
  }

  async update(id: string, data: Partial<Lot>): Promise<Lot | null> {
    const updated = await this.prisma.lote.update({
      where: { id },
      data,
    });
    if (!updated) {
      return null;
    }
    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.lote.delete({
        where: { id },
      });
    } catch {
      throw new NotFoundException('No se pudo eliminar el lote');
    }
  }

  async findWithFilters(
    userId: string,
    filters: FilterLotsDTO,
  ): Promise<Lot[]> {
    const where: any = {
      usuario_id: userId,
    };

    if (filters.nombre) {
      where.nombre = {
        contains: filters.nombre.trim(),
        mode: 'insensitive',
      };
    }

    if (filters.estado === LotStatus.HEALTHY) {
      where.alerta = {
        none: {
          resuelta: false,
        },
      };
    }

    if (filters.estado === LotStatus.RISK) {
      where.alerta = {
        some: {
          resuelta: false,
          OR: [{ nivel: 'ALTO' }, { nivel: 'MEDIO' }],
        },
      };
    }

    if (filters.estado === LotStatus.OBSERVATION) {
      where.AND = [
        {
          alerta: {
            some: {
              resuelta: false,

              nivel: 'BAJO',
            },
          },
        },
        {
          alerta: {
            none: {
              resuelta: false,
              OR: [{ nivel: 'ALTO' }, { nivel: 'MEDIO' }],
            },
          },
        },
      ];
    }

    const lotes = await this.prisma.lote.findMany({
      where,
      include: {
        alerta: true,
      },
    });
    return lotes.map(this.toDomain);
  }

  private toDomain(lote: any): Lot {
    const alertasActivas: any[] =
      lote.alerta?.filter((a: any) => !a.resuelta) ?? [];
    let estado: string;
    const tieneAlto = alertasActivas.some(
      (a) => a.nivel === 'ALTO' || a.nivel === 'MEDIO',
    );
    const tieneBajo = alertasActivas.some((a) => a.nivel === 'BAJO');
    if (tieneAlto) {
      estado = 'Riesgo';
    } else if (tieneBajo) {
      estado = 'Observación';
    } else {
      estado = 'Sano';
    }

    return new Lot(
      lote.id,
      lote.usuario_id,
      lote.nombre,
      lote.hectareas,
      lote.temperatura_min,
      lote.temperatura_max,
      lote.etapa_actual_id,
      lote.fecha_inicio,
      lote.numero_plantas,
      estado,
    );
  }
}
