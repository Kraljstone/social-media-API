import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostEntity, postSchema } from 'src/schemas/Post.schema';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { User, userSchema } from 'src/schemas/User.schema';
import { Services } from 'src/utils/constants';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: PostEntity.name,
        schema: postSchema,
      },
      {
        name: User.name,
        schema: userSchema,
      },
    ]),
  ],
  controllers: [PostsController],
  providers: [
    {
      provide: Services.POSTS,
      useClass: PostsService,
    },
  ],
})
export class PostsModule {}
