import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Inject,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { CreateNotificationDto } from './dto/notification/notification.dto';
import { INotificationService } from './notification';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { AuthenticatedGuard } from 'src/auth/guards/local.guard';

@Controller(Routes.NOTIFICATIONS)
@UseGuards(AuthenticatedGuard, JwtAuthGuard)
export class NotificationController {
  constructor(
    @Inject(Services.NOTIFICATION)
    private readonly notificationService: INotificationService,
  ) {}

  // @route  api/notification
  @Post()
  @UsePipes(new ValidationPipe())
  createNotification(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.createNotification(createNotificationDto);
  }

  @Get()
  @UsePipes(new ValidationPipe())
  getNotifications() {
    return this.notificationService.getNotifications();
  }

  @Get(':id')
  @UsePipes(new ValidationPipe())
  getNotificationById(@Param('id') id: string) {
    return this.notificationService.getNotificationById(id);
  }

  @Delete(':id')
  @UsePipes(new ValidationPipe())
  async deleteNotification(@Param('id') id: string) {
    const notification = await this.notificationService.getNotificationById(id);
    return {
      message: `Notification with ID: ${notification._id} and title: "${notification.title}" was deleted successfully.`,
    };
  }
}
