import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Like } from 'src/schemas/Like.schema';
import { PostEntity } from 'src/schemas/Post.schema';
import { User } from 'src/schemas/User.schema';
import { ILikesService } from '../posts';

@Injectable()
export class LikesService implements ILikesService {
  constructor(
    @InjectModel(Like.name) private readonly likeModel: Model<Like>,
    @InjectModel(PostEntity.name) private readonly postModel: Model<PostEntity>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async likePost(postId: string, userId: string): Promise<Like> {
    const post = await this.postModel.findById(postId);
    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    const existingLike = await this.likeModel.findOne({
      post: postId,
      user: userId,
    });
    if (existingLike) {
      throw new HttpException('Post already liked', HttpStatus.BAD_REQUEST);
    }

    const like = new this.likeModel({
      post: postId,
      user: userId,
    });

    try {
      return await like.save();
    } catch (error) {
      console.error('Error saving like:', error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async unlikePost(postId: string, userId: string): Promise<void> {
    const result = await this.likeModel.deleteOne({
      post: postId,
      user: userId,
    });
    if (result.deletedCount === 0) {
      throw new HttpException('Like not found', HttpStatus.NOT_FOUND);
    }
  }
}
