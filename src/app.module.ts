import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { config } from './config/config';
import { UserModule } from './modules/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsModule } from './modules/posts/posts.module';
import { JwtModule } from '@nestjs/jwt';
import { generateRandomString } from './utils/random-string';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    JwtModule.register({
      secret: generateRandomString(32),
      signOptions: { expiresIn: '1h' },
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    UserModule,
    PostsModule,
    AuthModule,
  ],
})
export class AppModule {}
