import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/User.schema';
import { UserSettings } from 'src/schemas/UserSettings.schema';
import { CreateUserDetails, UpdateUserDetails } from 'src/utils/types';
import { hashPassword } from 'src/utils/helpers';
import { IUserService } from './user';
import { UserNotFoundException } from 'src/utils/custom-exceptions';

@Injectable()
export class UsersService implements IUserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(UserSettings.name)
    private readonly userSettingsModel: Model<UserSettings>,
  ) {}

  async createUser({ settings, password, ...createUser }: CreateUserDetails) {
    const existingUser = await this.userModel.findOne({
      username: createUser.username,
    });

    if (existingUser) {
      throw new HttpException('Username is already taken', HttpStatus.CONFLICT);
    }

    const hashedPassword = await hashPassword(password);

    if (settings) {
      const newSettings = new this.userSettingsModel(settings);
      const savedNewSettings = await newSettings.save();

      const newUser = new this.userModel({
        ...createUser,
        password: hashedPassword,
        settings: savedNewSettings._id,
      });

      return newUser.save();
    }

    const newUser = new this.userModel({
      password: hashedPassword,
      ...createUser,
    });

    return newUser.save();
  }

  async getUsers() {
    return this.userModel.find().populate(['settings', 'posts']);
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).populate('settings');
    if (!user) {
      throw new UserNotFoundException(id);
    }
    return user;
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDetails,
  ): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      updateUserDto,
      { new: true },
    );
    if (!updatedUser) {
      throw new UserNotFoundException(id);
    }
    return updatedUser;
  }

  async deleteUser(id: string): Promise<object> {
    const deletedUser = await this.userModel.findByIdAndDelete(id);
    if (!deletedUser) {
      throw new UserNotFoundException(id);
    }
    return { message: 'User deleted successfully' };
  }
}
