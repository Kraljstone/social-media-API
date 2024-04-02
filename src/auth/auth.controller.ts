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
import { CreateUserDto } from 'src/auth/dto/create-user-dto/create-user-dto';
import { UsersService } from 'src/modules/users/users.service';
import { User } from 'src/schemas/User.schema';

@Controller(Routes.AUTH)
export class AuthController {
  constructor(
    @Inject(Services.AUTH)
    private authService: AuthService,
    @Inject(Services.USERS)
    private usersService: UsersService,
  ) {}

  // @route  api/auth/register
  @Post('register')
  @UsePipes(new ValidationPipe())
  createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  // @route  api/auth/login
  @Post('login')
  @UseGuards(LocalGuard)
  login(@Body() authPayload: AuthPayloadDto): Promise<string> {
    return this.authService.validateUser(authPayload);
  }
}
