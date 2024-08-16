export type ValidateUserDetails = {
  username: string;
  password: string;
};

export type CreateUserDetails = {
  username: string;
  password: string;
  displayName?: string;
  settings?: CreateUserSettings;
};

export class CreateUserSettings {
  receiveNotification?: boolean;
  receiveEmail?: boolean;
  receiveSMS?: boolean;
}

export type CreateConversationParams = {
  authorId: number;
  recipientId: number;
  message: string;
};

export type CreatePostDetails = {
  title: string;
  contents: string;
  userId: string;
};

export type UpdateUserDetails = {
  displayName?: string;
  avatarUrl?: string;
};

export type ChatRoomDetails = {
  chatRoomName: string;
  participantId: string;
};

export type FriendRequestDetails = {
  sender: string;
  receiver: string;
  status: string;
};

export type UpdateFriendRequestDetails = {
  sender: string;
  receiver: string;
  status: string;
};

export type CreateNotificationDetails = {
  title: string;
  message: string;
  userId: string;
};
