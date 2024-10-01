import { IsOptional, IsString, IsArray, IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  contents: string;

  @IsOptional()
  location?: [number, number];

  @IsOptional()
  @IsArray()
  mentions?: string[];

  @IsOptional()
  @IsArray()
  hashtags?: string[];

  @IsString()
  userId: string;
}
