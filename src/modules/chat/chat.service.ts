import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { IChatService } from './chat';
import { InjectModel } from '@nestjs/mongoose';
import { ChatRoom } from 'src/schemas/ChatRoom.schema';
import { Model } from 'mongoose';
import { User } from 'src/schemas/User.schema';

export class Message {
  senderId: string;
  message: string;
  timestamp: Date;
}

@Injectable()
export class ChatService implements IChatService {
  constructor(
    @InjectModel(ChatRoom.name) private readonly chatModel: Model<ChatRoom>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createChatRoom({ chatRoomName, participantId }: any) {
    const existingChatRoom = await this.chatModel.findOne({ chatRoomName });

    if (existingChatRoom) {
      throw new HttpException(
        'Chat room name already in use.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.userModel.findById(participantId);

    if (!user) {
      throw new HttpException('Invalid participant ID.', HttpStatus.NOT_FOUND);
    }

    const chatRoom = new this.chatModel({
      chatRoomName,
      participantIds: [participantId],
    });

    await chatRoom.save();

    return chatRoom;
  }

  async joinChatRoom(roomId: string, { participantId }) {
    const chatRoom = await this.chatModel.findById(roomId);

    if (!chatRoom) {
      throw new HttpException('Chat room not found.', 404);
    }

    if (chatRoom.participantIds.includes(participantId)) {
      throw new HttpException('User already a member of chat room.', 400);
    }

    chatRoom.participantIds.push(participantId);

    await chatRoom.save();

    return { message: 'User joined chat room successfully.' };
  }

  async leaveChatRoom(roomId: string, { participantId }) {
    const chatRoom = await this.chatModel.findById(roomId);

    if (!chatRoom) {
      throw new HttpException('Chat room not found.', 404);
    }

    if (!chatRoom.participantIds.includes(participantId)) {
      throw new HttpException('User is not a member of chat room.', 400);
    }

    chatRoom.participantIds = chatRoom.participantIds.filter(
      (id) => id !== participantId,
    );

    await chatRoom.save();

    return { message: 'User left chat room successfully.' };
  }

  async sendMessage(roomId: string, { senderId, message }) {
    const chatRoom = await this.chatModel.findById(roomId);

    if (!chatRoom) {
      throw new HttpException('Chat room not found.', 404);
    }

    const newMessage = {
      senderId,
      message,
      timestamp: new Date(),
    };

    chatRoom.messages.push(newMessage);

    await chatRoom.save();

    return newMessage;
  }
}
