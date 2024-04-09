import {
  Controller,
  Post,
  Body,
  Inject,
  Get,
  HttpException,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { FriendRequestDto } from './dto/friend-request-dto/friend-request-dto';
import { IFriendRequestService } from './friend-request';
import { Routes, Services } from 'src/utils/constants';
import mongoose from 'mongoose';

@Controller(Routes.FRIEND_REQUEST)
export class FriendRequestController {
  constructor(
    @Inject(Services.FRIEND_REQUEST)
    private readonly friendRequestService: IFriendRequestService,
  ) {}

  @Post()
  createFriendRequest(@Body() friendRequestDto: FriendRequestDto) {
    return this.friendRequestService.createFriendRequest(friendRequestDto);
  }

  @Get()
  getAllFriendRequests() {
    return this.friendRequestService.getAllFriendRequests();
  }

  @Get(':id')
  async getFriendRequestById(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Invalid ID', 404);

    const friendRequest =
      await this.friendRequestService.getFriendRequestById(id);
    if (!friendRequest)
      throw new HttpException('Friend request not found', 404);

    return friendRequest;
  }

  @Patch(':id')
  async updateFriendRequest(
    @Param('id') id: string,
    @Body() updateFriendRequestDto: FriendRequestDto,
  ) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Invalid ID', 404);

    const friendRequest = await this.friendRequestService.updateFriendRequest(
      id,
      updateFriendRequestDto,
    );
    if (!friendRequest)
      throw new HttpException('Friend request not found', 404);

    return friendRequest;
  }

  @Delete(':id')
  async removeFriendRequest(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Request already deleted', 404);

    const friendRequest =
      await this.friendRequestService.removeFriendRequestById(id);
    if (!friendRequest)
      throw new HttpException('Friend request not found', 404);

    return friendRequest;
  }
}
