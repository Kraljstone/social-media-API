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

export type AuthPayload = {
  username: string;
  password: string;
};
