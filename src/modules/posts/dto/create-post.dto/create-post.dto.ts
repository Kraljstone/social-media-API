import { IsOptional, IsString, IsArray } from 'class-validator';

export class CreatePostDto {
  @IsString()
  title: string;

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
