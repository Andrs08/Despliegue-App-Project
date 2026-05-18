import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { DashboardRepository } from 'src/dashboard/domain/repositories/dashboard.repository';
import { GeneralSummary } from 'src/dashboard/domain/interfaces/general-summary.interface';
import { LotStatus } from 'src/dashboard/domain/interfaces/lot-status.interface';
import { StageDistribution } from 'src/dashboard/domain/interfaces/stage-distribution.interface';
import { ActiveAlerts } from 'src/dashboard/domain/interfaces/active-alerts.interface';
import { Production } from 'src/dashboard/domain/interfaces/production-by-lot.interface';

@Injectable()
export class PrismaDashboardRepository implements DashboardRepository {
  constructor(private prisma: PrismaService) {}

  async getGeneralSummary(userId: string): Promise<GeneralSummary> {
    const total_lotes = await this.prisma.lote.count({
      where: {
        usuario_id: userId,
      },
    });

    const hectareas = await this.prisma.lote.aggregate({
      where: {
        usuario_id: userId,
      },
      _sum: {
        hectareas: true,
      },
    });

    const plantas = await this.prisma.lote.aggregate({
      where: {
        usuario_id: userId,
      },
      _sum: {
        numero_plantas: true,
      },
    });

    const lotes = await this.prisma.lote.findMany({
      where: {
        usuario_id: userId,
      },
      select: {
        id: true,
      },
    });

    const lotesIds = lotes.map((lote) => lote.id);

    const alertas_activas = await this.prisma.alerta.count({
      where: {
        resuelta: false,
        lote_id: {
          in: lotesIds,
        },
      },
    });

    const lotesRiesgo = await this.prisma.alerta.findMany({
      where: {
        resuelta: false,
        lote_id: {
          in: lotesIds,
        },
        OR: [{ nivel: 'ALTO' }, { nivel: 'MEDIO' }],
      },
      distinct: ['lote_id'],
    });

    return {
      total_lotes,
      total_hectareas: hectareas._sum.hectareas || 0,
      total_plantas: plantas._sum.numero_plantas || 0,
      alertas_activas,
      lotes_riesgo: lotesRiesgo.length,
    };
  }

  async getLotStatus(userId: string): Promise<LotStatus> {
    const lotes = await this.prisma.lote.findMany({
      where: {
        usuario_id: userId,
      },
      include: {
        alerta: true,
      },
    });

    let riesgo = 0;
    let observacion = 0;
    let sanos = 0;

    for (const lote of lotes) {
      const activas = lote.alerta.filter((a) => !a.resuelta);

      const altaOMedia = activas.some(
        (a) => a.nivel === 'ALTO' || a.nivel === 'MEDIO',
      );

      const baja = activas.some((a) => a.nivel === 'BAJO');

      if (altaOMedia) {
        riesgo++;
      } else if (baja) {
        observacion++;
      } else {
        sanos++;
      }
    }

    return {
      riesgo,
      observacion,
      sanos,
    };
  }

  async getStageDistribution(userId: string): Promise<StageDistribution[]> {
    const etapas = await this.prisma.lote.groupBy({
      by: ['etapa_actual_id'],
      where: {
        usuario_id: userId,
      },
      _count: true,
    });

    return etapas;
  }

  async getActiveAlerts(userId: string): Promise<ActiveAlerts> {
    const lotes = await this.prisma.lote.findMany({
      where: {
        usuario_id: userId,
      },
      select: {
        id: true,
      },
    });

    const lotesIds = lotes.map((lote) => lote.id);

    const total = await this.prisma.alerta.count({
      where: {
        resuelta: false,
        lote_id: {
          in: lotesIds,
        },
      },
    });

    const niveles = await this.prisma.alerta.groupBy({
      by: ['nivel'],
      where: {
        resuelta: false,
        lote_id: {
          in: lotesIds,
        },
      },
      _count: true,
    });

    return {
      total,
      niveles,
    };
  }

  async getProductionByLot(userId: string): Promise<Production[]> {
    const lotes = await this.prisma.lote.findMany({
      where: {
        usuario_id: userId,
      },
    });

    const resultado: Production[] = [];

    for (const lote of lotes) {
      const produccion_estimada = (lote.numero_plantas || 0) * 25;

      const cosecha = await this.prisma.registro_etapa.findFirst({
        where: {
          lote_id: lote.id,
          etapa_id: 6,
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      let produccion_real = 0;

      if (cosecha && cosecha.datos) {
        produccion_real = Number(cosecha.datos['kg_cosechados']) || 0;
      }

      resultado.push({
        lote_id: lote.id,
        lote_nombre: lote.nombre,
        produccion_estimada,
        produccion_real,
      });
    }

    return resultado;
  }
}
