import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PostEntity } from 'src/schemas/Post.schema';
import { Model } from 'mongoose';
import { CreatePostsDto } from './dto/create-posts.dto/create-posts.dto';
import { User } from 'src/schemas/User.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(PostEntity.name) private postModel: Model<PostEntity>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async createPost({ userId, ...createPostsDto }: CreatePostsDto) {
    const findUser = await this.userModel.findById(userId);
    if (!findUser) throw new HttpException('User Not Found', 404);
    const newPost = new this.postModel({ ...createPostsDto, user: userId });

    const savedPost = await newPost.save();
    await findUser.updateOne({
      $push: {
        posts: savedPost._id,
      },
    });

    return savedPost;
  }

  async getPosts(
    userId: string,
    sortBy?: 'asc' | 'desc',
    page?: number,
    limit?: number,
  ): Promise<PostEntity[]> {
    const findUser = await this.userModel.findById(userId);
    if (!findUser) throw new HttpException('User Not Found', 404);

    const skip = (page - 1) * limit;

    let query = this.postModel.find();

    if (sortBy) {
      const sortOrder = sortBy === 'desc' ? -1 : 1;
      query = query.sort({ createdAt: sortOrder });
    }

    query = query.skip(skip).limit(limit);

    return query.exec();
  }
}
