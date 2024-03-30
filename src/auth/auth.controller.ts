import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto/auth.dto';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { Routes } from 'src/utils/types';

@Controller(Routes.AUTH)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalGuard)
  login(@Body() authPayload: AuthPayloadDto) {
    return this.authService.validateUser(authPayload);
  }
}
