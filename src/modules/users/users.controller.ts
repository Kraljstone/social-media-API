import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  UsePipes,
  ValidationPipe,
  Param,
  HttpException,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user-dto/create-user-dto';
import mongoose from 'mongoose';
import { UpdateUserDto } from './dto/update-user-dto/update-user-dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  createUser(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }

  //users/:id
  @Get(':id')
  async getUserById(@Param('id') id: string) {
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
  ) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Invalid ID', 404);

    const updateUser = await this.usersService.updateUser(id, updateUserDto);

    if (!updateUser) throw new HttpException('User Not Found', 404);

    return updateUser;
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('User not found', 404);

    const deletedUser = await this.usersService.deleteUser(id);

    if (!deletedUser) throw new HttpException('User Not Found', 404);
    console.log(deletedUser);
  }
}
