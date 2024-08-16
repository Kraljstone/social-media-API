import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import {
  Notification,
  NotificationSchema,
} from 'src/schemas/Notification.schema';
import { Services } from 'src/utils/constants';
import { User, userSchema } from 'src/schemas/User.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
      {
        name: User.name,
        schema: userSchema,
      },
    ]),
  ],
  providers: [
    { provide: Services.NOTIFICATION, useClass: NotificationService },
  ],
  controllers: [NotificationController],
})
export class NotificationModule {}
