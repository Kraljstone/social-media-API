import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { config } from './config/config';
import { UserModule } from './modules/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsModule } from './modules/posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { GatewayModule } from './gateway/gateway.module';
import { ChatModule } from './modules/chat/chat.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerBehindProxyGuard } from './utils/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 600,
        limit: 10,
      },
    ]),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    AuthModule,
    UserModule,
    PostsModule,
    GatewayModule,
    ChatModule,
  ],

  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },
  ],
})
export class AppModule {}
