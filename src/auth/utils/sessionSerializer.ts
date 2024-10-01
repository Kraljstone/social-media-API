import { PassportSerializer } from '@nestjs/passport';
import { User } from 'src/schemas/User.schema';
import { UsersService } from 'src/modules/users/users.service';
import { Inject, Injectable } from '@nestjs/common';
import { Services } from 'src/utils/constants';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    @Inject(Services.AUTH) private readonly userService: UsersService,
  ) {
    super();
  }

  serializeUser(user: User, done: (err: Error, user: User) => void) {
    done(null, user);
  }

  async deserializeUser(user: User, done: (err: Error, user: User) => void) {
    const userDB = await this.userService.getUserById(user._id);
    return userDB?._id ? done(null, userDB) : done(null, null);
  }
}
