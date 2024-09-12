import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostEntity, postSchema } from 'src/schemas/Post.schema';
import { User, userSchema } from 'src/schemas/User.schema';
import {
  MentionsAndHashtagsEntity,
  MentionsAndHashtagsSchema,
} from 'src/schemas/MentionsAndHashtags.schema';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
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
      {
        name: MentionsAndHashtagsEntity.name,
        schema: MentionsAndHashtagsSchema,
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
