import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from 'src/schemas/Post.schema';
import { Model } from 'mongoose';
import { CreatePostsDto } from './dto/create-posts.dto/create-posts.dto';
import { User } from 'src/schemas/User.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
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

  async getPosts(userId: string, sortBy?: 'asc' | 'desc'): Promise<Post[]> {
    const findUser = await this.userModel.findById(userId);
    if (!findUser) throw new HttpException('User Not Found', 404);

    const query = this.postModel.find().sort({ createdAt: sortBy });
    return query.exec();
  }
}
