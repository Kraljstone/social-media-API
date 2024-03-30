import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { generateRandomString } from 'src/utils/random-string';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from 'src/schemas/User.schema';
import { userSchema } from 'src/schemas/User.schema';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserSettings } from 'src/schemas/UserSettings.schema';
import { UserSettingsSchema } from 'src/schemas/UserSettings.schema';
import { Services } from 'src/utils/types';

export const authSecret = generateRandomString(32);

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: userSchema,
      },
      {
        name: UserSettings.name,
        schema: UserSettingsSchema,
      },
    ]),
    JwtModule.register({
      secret: authSecret,
      signOptions: { expiresIn: '1d' },
    }),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    {
      provide: Services.AUTH,
      useClass: AuthService,
    },
  ],
})
export class AuthModule {}
