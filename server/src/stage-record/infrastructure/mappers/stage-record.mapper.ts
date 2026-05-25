import { StageRecord } from '../../domain/entities/stage-record.entity';

export class StageRecordMapper {
  static toDomain(raw: any): StageRecord {
    return new StageRecord(
      raw.id,
      raw.lote_id,
      raw.etapa_id,
      raw.datos,
      raw.fecha,
      raw.created_at,
    );
  }
}
