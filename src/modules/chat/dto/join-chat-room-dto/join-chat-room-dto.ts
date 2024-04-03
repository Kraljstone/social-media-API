import { IsObject, IsString, IsNotEmpty } from 'class-validator';

export class JoinChatRoomDto {
  @IsNotEmpty()
  @IsString()
  participantId: string;

  @IsObject()
  @IsNotEmpty()
  joinChatRoomDto: {
    participantId: string;
  };
}

export class LeaveChatRoomDto extends JoinChatRoomDto {}
