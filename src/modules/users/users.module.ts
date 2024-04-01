import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from 'src/schemas/User.schema';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Services } from 'src/utils/constants';
import { UserSettings } from 'src/schemas/UserSettings.schema';
import { UserSettingsSchema } from 'src/schemas/UserSettings.schema';

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
  ],
  providers: [
    {
      provide: Services.USERS,
      useClass: UsersService,
    },
  ],
  controllers: [UsersController],
})
export class UserModule {}
