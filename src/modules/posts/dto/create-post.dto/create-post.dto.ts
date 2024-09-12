import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  contents: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  location?: [number, number];

  @IsString()
  @IsNotEmpty()
  userId: string;
}
