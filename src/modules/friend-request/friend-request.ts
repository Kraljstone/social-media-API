import {
  FriendRequestDetails,
  UpdateFriendRequestDetails,
} from 'src/utils/types';

export interface IFriendRequestService {
  createFriendRequest(createFriendRequestDto: object): Promise<any>;
  getAllFriendRequests(): Promise<FriendRequestDetails[]>;
  getFriendRequestById(id: string): Promise<FriendRequestDetails>;
  updateFriendRequest(
    id: string,
    updateFriendRequestDto: UpdateFriendRequestDetails,
  ): Promise<UpdateFriendRequestDetails>;
  removeFriendRequestById(id: string): Promise<object>;
}
