import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  message: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
