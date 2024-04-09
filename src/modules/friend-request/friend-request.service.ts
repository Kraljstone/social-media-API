import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { IFriendRequestService } from './friend-request';
import {
  FriendRequestDetails,
  UpdateFriendRequestDetails,
} from 'src/utils/types';
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

  async createFriendRequest({
    sender,
    receiver,
    status,
  }: FriendRequestDetails) {
    const existingSender = await this.userModel.findOne({ sender });

    const existingReceiver = await this.userModel.findOne({ receiver });

    if (!existingSender) {
      throw new HttpException(
        `No user found with username ${sender}`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (!existingReceiver) {
      throw new HttpException(
        `No user found with username ${receiver}`,
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
      sender: sender,
      receiver: receiver,
    });

    if (existingFriendRequest) {
      throw new HttpException(
        'Friend request already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newFriendRequest = new this.friendRequestModel({
      sender: sender,
      receiver: receiver,
      status,
    });
    return await newFriendRequest.save();
  }

  getAllFriendRequests(): Promise<FriendRequestDetails[]> {
    return this.friendRequestModel.find();
  }

  async getFriendRequestById(id: string): Promise<FriendRequestDetails> {
    const friendRequest = await this.friendRequestModel.findOne({ _id: id });
    if (!friendRequest) {
      throw new HttpException('Friend request not found', 404);
    }

    return friendRequest.toObject();
  }

  async updateFriendRequest(
    id: string,
    { sender, receiver, status }: UpdateFriendRequestDetails,
  ) {
    const friendRequest = await this.friendRequestModel.findOne({ _id: id });

    if (!friendRequest) {
      throw new HttpException('Friend request not found', 404);
    }

    friendRequest.status = status;

    await friendRequest.save();

    return {
      sender,
      receiver,
      status: friendRequest.status,
    };
  }

  async removeFriendRequestById(id: string) {
    await this.friendRequestModel.findByIdAndDelete(id);
    return {
      message: 'Friend request removed',
    };
  }
}
