import { CreateUserDetails, UpdateUserDetails } from 'src/utils/types';
import { User } from 'src/schemas/User.schema';

export interface IUserService {
  createUser(userDetails: CreateUserDetails): Promise<User>;
  getUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User>;
  updateUser(id: string, updateDetails: UpdateUserDetails): Promise<User>;
  deleteUser(id: string): Promise<object>;
}
