import { Module } from '@nestjs/common';
import { FriendRequestService } from './friend-request.service';
import { Services } from 'src/utils/constants';
import { MongooseModule } from '@nestjs/mongoose';
import {
  friendRequestsSchema,
  FriendRequests,
} from 'src/schemas/FriendRequests.schema';
import { FriendRequestController } from './friend-request.controller';
import { User, userSchema } from 'src/schemas/User.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: FriendRequests.name,
        schema: friendRequestsSchema,
      },
      {
        name: User.name,
        schema: userSchema,
      },
    ]),
  ],
  providers: [
    {
      provide: Services.FRIEND_REQUEST,
      useClass: FriendRequestService,
    },
  ],
  controllers: [FriendRequestController],
})
export class FriendRequestModule {}
