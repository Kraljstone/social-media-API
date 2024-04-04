import {
  Controller,
  Post,
  Body,
  Param,
  Inject,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { Services } from 'src/utils/constants';
import { Routes } from 'src/utils/constants';
import { CreateChatRoomDto } from './dto/create-chat-room-dto/create-chat-room-dto';
import {
  JoinChatRoomDto,
  LeaveChatRoomDto,
} from './dto/join-chat-room-dto/join-chat-room-dto';
import { SendMessageDto } from './send-message-dto/send-message-dto';

@Controller(Routes.CHAT)
export class ChatController {
  constructor(
    @Inject(Services.CHAT) private readonly chatService: ChatService,
  ) {}

  @Post()
  async createChatRoom(@Body() createChatRoomDto: CreateChatRoomDto) {
    return this.chatService.createChatRoom(createChatRoomDto);
  }

  @Post(':roomId/join')
  async joinChatRoom(
    @Param('roomId', ParseUUIDPipe) roomId: string,
    @Body() joinChatRoomDto: JoinChatRoomDto,
  ) {
    return this.chatService.joinChatRoom(roomId, joinChatRoomDto);
  }

  @Post(':roomId/leave')
  async leaveChatRoom(
    @Param('roomId', ParseUUIDPipe) roomId: string,
    @Body() leaveChatRoomDto: LeaveChatRoomDto,
  ) {
    return this.chatService.leaveChatRoom(roomId, leaveChatRoomDto);
  }

  @Post(':roomId/messages')
  async sendMessage(
    @Param('roomId', ParseUUIDPipe) roomId: string,
    @Body() sendMessageDto: SendMessageDto,
  ) {
    return this.chatService.sendMessage(roomId, sendMessageDto);
  }
}
