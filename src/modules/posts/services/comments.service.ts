import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from 'src/schemas/Comment.schema';
import { PostEntity } from 'src/schemas/Post.schema';
import { User } from 'src/schemas/User.schema';
import { ICommentsService } from '../posts';

@Injectable()
export class CommentsService implements ICommentsService {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
    @InjectModel(PostEntity.name) private readonly postModel: Model<PostEntity>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async addComment(
    postId: string,
    userId: string,
    text: string,
  ): Promise<Comment> {
    const comment = new this.commentModel({ post: postId, user: userId, text });
    return comment.save();
  }

  async editComment(
    commentId: string,
    userId: string,
    text: string,
  ): Promise<Comment> {
    const comment = await this.commentModel.findOne({
      _id: commentId,
      user: userId,
    });
    if (!comment) {
      throw new HttpException(
        'Comment not found or unauthorized',
        HttpStatus.NOT_FOUND,
      );
    }

    comment.text = text;
    return comment.save();
  }

  async deleteComment(commentId: string, userId: string): Promise<void> {
    const result = await this.commentModel.deleteOne({
      _id: commentId,
      user: userId,
    });
    if (result.deletedCount === 0) {
      throw new HttpException(
        'Comment not found or unauthorized',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
