import {
  Body,
  Controller,
  Inject,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Routes } from 'src/utils/constants';
// import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Services } from 'src/utils/constants';
import { IConversationsService } from './conversations';
import { CreateConversation } from './dto/create-conversation/create-conversation';

@Controller(Routes.CONVERSATIONS)
export class ConversationsController {
  constructor(
    @Inject(Services.CONVERSATIONS)
    private readonly conversationsService: IConversationsService,
  ) {}

  // api/conversations
  @Post()
  // @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  createConversation(@Body() createConversationPayload: CreateConversation) {
    return this.conversationsService.createConversation(
      createConversationPayload,
    );
  }
}
