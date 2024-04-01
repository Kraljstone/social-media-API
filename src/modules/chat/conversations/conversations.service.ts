import { Injectable } from '@nestjs/common';
import { IConversationsService } from './conversations';
import { CreateConversationParams } from 'src/utils/types';

@Injectable()
export class ConversationsService implements IConversationsService {
  createConversation(params: CreateConversationParams) {
    console.log(params);
  }
}
