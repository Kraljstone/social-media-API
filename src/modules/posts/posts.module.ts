import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostEntity, postSchema } from 'src/schemas/Post.schema';
import { User, userSchema } from 'src/schemas/User.schema';
import {
  MentionsAndHashtagsEntity,
  MentionsAndHashtagsSchema,
} from 'src/schemas/MentionsAndHashtags.schema';
import { Like, LikeSchema } from 'src/schemas/Like.schema';
import { Comment, CommentSchema } from 'src/schemas/Comment.schema';
import { PostsService } from './services/posts.service';
import { LikesService } from './services/likes.service';
import { CommentsService } from './services/comments.service';
import { PostsController } from './controllers/posts.controller';
import { LikesController } from './controllers/likes.controller';
import { CommentsController } from './controllers/comments.controller';
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
      {
        name: Like.name,
        schema: LikeSchema,
      },
      {
        name: Comment.name,
        schema: CommentSchema,
      },
    ]),
  ],
  controllers: [PostsController, LikesController, CommentsController],
  providers: [
    {
      provide: Services.POSTS,
      useClass: PostsService,
    },
    {
      provide: Services.MENTIONS,
      useClass: MentionsService,
    },
    {
      provide: Services.HASHTAGS,
      useClass: HashtagsService,
    },
    {
      provide: Services.LIKES,
      useClass: LikesService,
    },
    {
      provide: Services.COMMENTS,
      useClass: CommentsService,
    },
  ],
})
export class PostsModule {}
