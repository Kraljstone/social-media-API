import {
  Body,
  Controller,
  Get,
  Patch,
  UsePipes,
  ValidationPipe,
  Param,
  HttpException,
  Delete,
  UseGuards,
  Inject,
  UseInterceptors,
} from '@nestjs/common';
import { IUserService } from './user';
import mongoose from 'mongoose';
import { UpdateUserDto } from './dto/update-user-dto/update-user-dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Routes, Services } from 'src/utils/constants';
import { User } from 'src/schemas/User.schema';
import { AuthenticatedGuard } from 'src/auth/guards/local.guard';
import { UsersInterceptor } from './interceptors/users.interceptor';

@Controller(Routes.USERS)
@UseGuards(AuthenticatedGuard)
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(@Inject(Services.USERS) private usersService: IUserService) {}

  @Get()
  @UseInterceptors(UsersInterceptor)
  getUsers(): Promise<User[]> {
    return this.usersService.getUsers();
  }

  // @route api/users/:id
  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User> {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('User not found', 404);

    const findUser = await this.usersService.getUserById(id);

    if (!findUser) throw new HttpException('User not found', 404);

    return findUser;
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Invalid ID', 404);

    const updateUser = await this.usersService.updateUser(id, updateUserDto);

    if (!updateUser) throw new HttpException('User Not Found', 404);

    return updateUser;
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<object> {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('User not found', 404);

    const deletedUser = await this.usersService.deleteUser(id);

    if (!deletedUser) throw new HttpException('User Not Found', 404);

    return { message: 'User deleted successfully' };
  }
}
