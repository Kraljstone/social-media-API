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
