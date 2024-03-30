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
import { Routes, Services } from 'src/utils/constants';
import { CreateUserDto } from 'src/modules/users/dto/create-user-dto/create-user-dto';
import { UsersService } from 'src/modules/users/users.service';

@Controller(Routes.AUTH)
export class AuthController {
  constructor(
    @Inject(Services.AUTH) private authService: AuthService,
    private usersService: UsersService,
  ) {}

  // auth/register
  @Post('register')
  @UsePipes(new ValidationPipe())
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  // auth/login
  @Post('login')
  @UseGuards(LocalGuard)
  login(@Body() authPayload: AuthPayloadDto) {
    return this.authService.validateUser(authPayload);
  }
}
