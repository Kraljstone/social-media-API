import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { MongooseModule } from '@nestjs/mongoose';
import { chatRoomSchema } from 'src/schemas/ChatRoom.schema';
import { ChatRoom } from 'src/schemas/ChatRoom.schema';
import { Services } from 'src/utils/constants';
import { User } from 'src/schemas/User.schema';
import { userSchema } from 'src/schemas/User.schema';
import { Gateway } from 'src/gateway/gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ChatRoom.name,
        schema: chatRoomSchema,
      },
      {
        name: User.name,
        schema: userSchema,
      },
    ]),
  ],
  controllers: [ChatController],
  providers: [
    {
      provide: Services.CHAT,
      useClass: ChatService,
    },
    Gateway,
  ],
})
export class ChatModule {}
