import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/User.schema';
import { UserSettings } from 'src/schemas/UserSettings.schema';
import { CreateUserDetails } from 'src/utils/types';
import { hashPassword } from 'src/utils/helpers';
import { UpdateUserDetails } from 'src/utils/types';
import { IUserService } from './user';

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

  getUsers() {
    return this.userModel.find().populate(['settings', 'posts']);
  }

  getUserById(id: string) {
    return this.userModel.findById(id).populate('settings');
  }

  updateUser(id: string, updateUserDto: UpdateUserDetails) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
  }

  deleteUser(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }
}
