import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateConversation {
  @IsNumber()
  @IsNotEmpty()
  authorId: number;

  @IsNumber()
  @IsNotEmpty()
  recipientId: number;

  @IsNotEmpty()
  @IsString()
  message: string;
}
