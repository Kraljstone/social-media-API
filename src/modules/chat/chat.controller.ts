import {
  Controller,
  Post,
  Body,
  Param,
  Inject,
  UseGuards,
  UsePipes,
  ValidationPipe,
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
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { AuthenticatedGuard } from 'src/auth/guards/local.guard';

@Controller(Routes.CHAT)
export class ChatController {
  constructor(
    @Inject(Services.CHAT) private readonly chatService: ChatService,
  ) {}

  @Post()
  @UseGuards(AuthenticatedGuard)
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async createChatRoom(@Body() createChatRoomDto: CreateChatRoomDto) {
    return this.chatService.createChatRoom(createChatRoomDto);
  }

  @Post(':roomId/join')
  @UseGuards(AuthenticatedGuard)
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async joinChatRoom(
    @Param('roomId') roomId: string,
    @Body() joinChatRoomDto: JoinChatRoomDto,
  ) {
    return this.chatService.joinChatRoom(roomId, joinChatRoomDto);
  }

  @Post(':roomId/leave')
  @UseGuards(AuthenticatedGuard)
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async leaveChatRoom(
    @Param('roomId') roomId: string,
    @Body() leaveChatRoomDto: LeaveChatRoomDto,
  ) {
    return this.chatService.leaveChatRoom(roomId, leaveChatRoomDto);
  }

  @Post(':roomId/messages')
  @UseGuards(AuthenticatedGuard)
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async sendMessage(
    @Param('roomId') roomId: string,
    @Body() sendMessageDto: SendMessageDto,
  ) {
    return this.chatService.sendMessage(roomId, sendMessageDto);
  }
}
