import { Injectable } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto/auth.dto';
import { User } from 'src/schemas/User.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,

    private readonly jwtService: JwtService,
  ) {}

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
