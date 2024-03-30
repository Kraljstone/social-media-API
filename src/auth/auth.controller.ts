import {
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Inject,
} from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto/auth.dto';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { Routes, Services } from 'src/utils/types';
import { RegisterUserDto } from 'src/auth/dto/register-user-dto/register-user-dto';

@Controller(Routes.AUTH)
export class AuthController {
  constructor(@Inject(Services.AUTH) private authService: AuthService) {}

  // auth/register
  @Post('register')
  @UsePipes(new ValidationPipe())
  createUser(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.registerUser(registerUserDto);
  }

  // auth/login
  @Post('login')
  @UseGuards(LocalGuard)
  login(@Body() authPayload: AuthPayloadDto) {
    return this.authService.validateUser(authPayload);
  }
}
