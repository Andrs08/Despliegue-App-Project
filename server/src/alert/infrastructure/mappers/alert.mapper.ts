import { Alert } from '../../domain/entities/alert.entity';

export class AlertMapper {
  static toDomain(raw: any): Alert {
    return new Alert(
      raw.id,
      raw.lote_id,
      raw.tipo,
      raw.nivel,
      raw.mensaje,
      raw.resuelta,
      raw.created_at,
    );
  }
}
