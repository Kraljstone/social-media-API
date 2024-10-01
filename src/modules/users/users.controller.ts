import {
  Body,
  Controller,
  Get,
  Patch,
  UsePipes,
  ValidationPipe,
  Param,
  Delete,
  UseGuards,
  Inject,
  UseInterceptors,
} from '@nestjs/common';
import { IUserService } from './user';
import { UpdateUserDto } from './dto/update-user-dto/update-user-dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Routes, Services } from 'src/utils/constants';
import { User } from 'src/schemas/User.schema';
import { AuthenticatedGuard } from 'src/auth/guards/local.guard';
import { UsersInterceptor } from './interceptors/users.interceptor';

@Controller(Routes.USERS)
@UseGuards(AuthenticatedGuard)
@UseInterceptors(UsersInterceptor)
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(@Inject(Services.USERS) private usersService: IUserService) {}

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User> {
    return this.usersService.getUserById(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<object> {
    return this.usersService.deleteUser(id);
  }
}
