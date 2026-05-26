import { Alert } from '../entities/alert.entity';

export abstract class AlertRepository {
  abstract create(alert: Alert): Promise<Alert>;
  abstract findAll(userId: string): Promise<Alert[]>;
  abstract findByLote(loteId: string, userId: string): Promise<Alert[]>;
  abstract markAsResolved(id: string): Promise<Alert>;
  abstract findIrrigationAlertToday(loteId: string): Promise<any>;
}
