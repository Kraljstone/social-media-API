import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto/auth.dto';
import { User } from 'src/schemas/User.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from 'src/auth/dto/register-user-dto/register-user-dto';
import { UserSettings } from 'src/schemas/UserSettings.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserSettings.name)
    private userSettingsModel: Model<UserSettings>,
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async registerUser({
    settings,
    password,
    ...createUserDto
  }: RegisterUserDto) {
    const existingUser = await this.userModel.findOne({
      username: createUserDto.username,
    });

    if (existingUser) {
      throw new HttpException('Username is already taken', HttpStatus.CONFLICT);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (settings) {
      const newSettings = new this.userSettingsModel(settings);
      const savedNewSettings = await newSettings.save();

      const newUser = new this.userModel({
        ...createUserDto,
        password: hashedPassword,
        settings: savedNewSettings._id,
      });

      return newUser.save();
    }

    const newUser = new this.userModel({
      password: hashedPassword,
      ...createUserDto,
    });

    return newUser.save();
  }

  async validateUser({ username, password }: AuthPayloadDto) {
    const user = await this.userModel.findOne({ username });

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      const payload = { username: user.username };
      const accessToken = this.jwtService.sign(payload);
      return accessToken;
    }
  }
}
