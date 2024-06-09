import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from 'src/schemas/User.schema';
import { userSchema } from 'src/schemas/User.schema';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Services } from 'src/utils/constants';
import { UsersService } from 'src/modules/users/users.service';
import { UserSettings } from 'src/schemas/UserSettings.schema';
import { userSettingsSchema } from 'src/schemas/UserSettings.schema';
import { SessionSerializer } from './utils/sessionSerializer';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: userSchema,
      },
      {
        name: UserSettings.name,
        schema: userSettingsSchema,
      },
    ]),
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    PassportModule.register({
      session: true,
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: Services.AUTH,
      useClass: AuthService,
    },
    {
      provide: Services.USERS,
      useClass: UsersService,
    },
    LocalStrategy,
    JwtStrategy,
    SessionSerializer,
  ],
})
export class AuthModule {}
