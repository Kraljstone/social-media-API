import { ChatRoomDetails } from 'src/utils/types';

export interface IChatService {
  createChatRoom({
    chatRoomName,
    participantId,
  }: ChatRoomDetails): Promise<object>;
  joinChatRoom(roomId: string, joinChatRoomDto: object): Promise<object>;
  leaveChatRoom(roomId: string, joinChatRoomDto: object): Promise<object>;
  sendMessage(roomId: string, sendMessageDto: object): Promise<object>;
}
