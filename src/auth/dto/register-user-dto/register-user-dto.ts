import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class RegisterUserSettingsDto {
  @IsOptional()
  @IsBoolean()
  receiveNotification?: boolean;

  @IsOptional()
  @IsBoolean()
  receiveEmail?: boolean;

  @IsOptional()
  @IsBoolean()
  receiveSMS?: boolean;
}

export class RegisterUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(32)
  username: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(32)
  password: string;

  @IsString()
  @IsOptional()
  @MaxLength(32)
  displayName?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => RegisterUserSettingsDto)
  settings?: RegisterUserSettingsDto;
}
