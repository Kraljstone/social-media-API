import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { IFriendRequestService } from './friend-request';
import { FriendRequestDetails } from 'src/utils/types';
import { InjectModel } from '@nestjs/mongoose';
import { FriendRequests } from 'src/schemas/FriendRequests.schema';
import { Model } from 'mongoose';
import { User } from 'src/schemas/User.schema';

@Injectable()
export class FriendRequestService implements IFriendRequestService {
  constructor(
    @InjectModel(FriendRequests.name)
    private readonly friendRequestModel: Model<FriendRequests>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create({
    senderUsername,
    receiverUsername,
    status,
  }: FriendRequestDetails) {
    const existingSender = await this.userModel.findOne({
      username: senderUsername,
    });

    const existingReceiver = await this.userModel.findOne({
      username: receiverUsername,
    });

    if (!existingSender) {
      throw new HttpException(
        `No user found with username ${senderUsername}`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (!existingReceiver) {
      throw new HttpException(
        `No user found with username ${receiverUsername}`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (existingSender.username === existingReceiver.username) {
      throw new HttpException(
        'Cannot send a friend request to yourself',
        HttpStatus.BAD_REQUEST,
      );
    }

    const existingFriendRequest = await this.friendRequestModel.findOne({
      sender: senderUsername,
      receiver: receiverUsername,
    });

    if (existingFriendRequest) {
      throw new HttpException(
        'Friend request already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newFriendRequest = new this.friendRequestModel({
      sender: senderUsername,
      receiver: receiverUsername,
      status,
    });
    return await newFriendRequest.save();
  }

  // async findAll() {
  //   return await FriendRequest.find();
  // }

  // async findOne(id: number) {
  //   return await FriendRequest.findOne(id);
  // }

  // async update(id: number, updateFriendRequestDto: UpdateFriendRequestDto) {
  //   const friendRequest = await FriendRequest.findOne(id);
  //   friendRequest.status = updateFriendRequestDto.status;

  //   return await friendRequest.save();
  // }

  // async remove(id: string) {
  //   await FriendRequest.delete(id);
  // }
}
