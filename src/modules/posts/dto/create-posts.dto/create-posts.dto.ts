import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatePostsDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  contents: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
