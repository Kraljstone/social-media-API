import { IsString, IsNotEmpty } from 'class-validator';

export class CreateChatRoomDto {
  @IsNotEmpty()
  @IsString()
  chatRoomName: string;

  @IsNotEmpty()
  @IsString()
  participantId: string;
}
