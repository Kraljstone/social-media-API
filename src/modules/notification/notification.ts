import { CreateNotificationDetails } from 'src/utils/types';
import { Notification } from 'src/schemas/Notification.schema';

export interface INotificationService {
  createNotification(
    notificationDto: CreateNotificationDetails,
  ): Promise<Notification>;

  getNotifications(): Promise<Notification[]>;
  getNotificationById(id: string): Promise<Notification>;
  deleteNotification(id: string): Promise<{ deleted: boolean }>;
}
