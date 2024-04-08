import { Controller, Post, Body, Inject } from '@nestjs/common';
import { FriendRequestDto } from './dto/friend-request-dto/friend-request-dto';
import { IFriendRequestService } from './friend-request';
import { Routes, Services } from 'src/utils/constants';

@Controller(Routes.FRIEND_REQUEST)
export class FriendRequestController {
  constructor(
    @Inject(Services.FRIEND_REQUEST)
    private readonly friendRequestService: IFriendRequestService,
  ) {}

  @Post()
  create(@Body() friendRequestDto: FriendRequestDto) {
    return this.friendRequestService.create(friendRequestDto);
  }
}
