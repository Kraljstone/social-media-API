// import { FriendRequestDetails } from 'src/utils/types';

export interface IFriendRequestService {
  create(createFriendRequestDto: object): Promise<any>;
  // findAll(): Promise<FriendRequestDetails[]>;
  // findOne(id: number): Promise<FriendRequestDetails>;
  // update(
  //   id: number,
  //   updateFriendRequestDto: FriendRequestDetails,
  // ): Promise<FriendRequestDetails>;
  // remove(id: number): Promise<void>;
}
