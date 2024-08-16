import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification } from 'src/schemas/Notification.schema';
import { INotificationService } from './notification';
import { CreateNotificationDetails } from 'src/utils/types';
import { Logger } from '@nestjs/common';
import { User } from 'src/schemas/User.schema';

@Injectable()
export class NotificationService implements INotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createNotification({
    userId,
    ...createNotificationDetails
  }: CreateNotificationDetails): Promise<Notification> {
    try {
      const userObjectId = new Types.ObjectId(userId);

      const createdNotification = new this.notificationModel({
        ...createNotificationDetails,
        userId: userObjectId,
      });

      return await createdNotification.save();
    } catch (error) {
      this.logger.error('Error creating notification', error.stack);
      throw new InternalServerErrorException('Failed to create notification');
    }
  }

  async getNotifications(): Promise<Notification[]> {
    try {
      return await this.notificationModel.find().exec();
    } catch (error) {
      this.logger.error('Error fetching notifications', error.stack);
      throw new InternalServerErrorException('Failed to fetch notifications');
    }
  }

  async getNotificationById(id: string): Promise<Notification> {
    try {
      const notification = await this.notificationModel.findById(id).exec();
      if (!notification) {
        throw new NotFoundException(`Notification with ID ${id} not found`);
      }
      return notification;
    } catch (error) {
      this.logger.error(
        `Error fetching notification by ID: ${id}`,
        error.stack,
      );
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch notification');
    }
  }

  async deleteNotification(id: string): Promise<{ deleted: boolean }> {
    try {
      const result = await this.notificationModel.deleteOne({ _id: id }).exec();
      if (result.deletedCount === 0) {
        throw new NotFoundException(`Notification with ID ${id} not found`);
      }
      return { deleted: true };
    } catch (error) {
      this.logger.error(
        `Error deleting notification by ID: ${id}`,
        error.stack,
      );
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete notification');
    }
  }
}
