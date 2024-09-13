import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostEntity, postSchema } from 'src/schemas/Post.schema';
import { User, userSchema } from 'src/schemas/User.schema';
import {
  MentionsAndHashtagsEntity,
  MentionsAndHashtagsSchema,
} from 'src/schemas/MentionsAndHashtags.schema';
import { PostsService } from './services/posts.service';
import { PostsController } from './posts.controller';
import { MentionsService } from './services/mentions.service';
import { HashtagsService } from './services/hashtags.service';
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
    MentionsService,
    HashtagsService,
  ],
})
export class PostsModule {}
