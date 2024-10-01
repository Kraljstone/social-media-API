import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostEntity } from 'src/schemas/Post.schema';
import { User } from 'src/schemas/User.schema';
import { MentionsAndHashtagsEntity } from 'src/schemas/MentionsAndHashtags.schema';
import { CreatePostDto } from '../dto/create-post.dto/create-post.dto';
import { getLocationName } from '../getLocationName';
import { IPostsService } from '../posts';
import { Services } from 'src/utils/constants';
import { IMentionsService, IHashtagsService } from '../posts';
import {
  PostNotFoundException,
  UserNotFoundException,
} from '../../../utils/custom-exceptions';

@Injectable()
export class PostsService implements IPostsService {
  constructor(
    @InjectModel(PostEntity.name) private readonly postModel: Model<PostEntity>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(MentionsAndHashtagsEntity.name)
    private readonly mentionsAndHashtagsModel: Model<MentionsAndHashtagsEntity>,
    @Inject(Services.MENTIONS)
    private readonly mentionsService: IMentionsService,
    @Inject(Services.HASHTAGS)
    private readonly hashtagsService: IHashtagsService,
  ) {}

  async createPost(createPostDto: CreatePostDto): Promise<PostEntity> {
    const { contents, location } = createPostDto;

    const mentions = await this.mentionsService.extractMentions(contents);
    const hashtags = this.hashtagsService.extractHashtags(contents);

    const newMentionsAndHashtags = new this.mentionsAndHashtagsModel({
      contents,
      mentions,
      hashtags,
    });
    await newMentionsAndHashtags.save();

    const newPost = new this.postModel({
      ...createPostDto,
      mentionsAndHashtags: newMentionsAndHashtags._id,
      ...(location && { location: { type: 'Point', coordinates: location } }),
    });

    return await newPost.save();
  }

  async getPosts(
    userId: string,
    sortBy: 'asc' | 'desc' = 'desc',
    page: number = 1,
    limit: number = 10,
  ): Promise<PostEntity[]> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new UserNotFoundException(userId);
    }

    const skip = (page - 1) * limit;

    const query = this.postModel
      .find()
      .populate({
        path: 'mentionsAndHashtags',
        populate: {
          path: 'mentions',
          select: 'username',
        },
      })
      .sort({ createdAt: sortBy === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(limit);

    return query.exec();
  }

  async getPostsNearLocation(
    longitude: number,
    latitude: number,
    radius: number,
    limit: number = 10,
  ): Promise<{ post: PostEntity; locationName: string }[]> {
    const locationName = await getLocationName(longitude, latitude);

    const posts = await this.postModel
      .find({
        location: {
          $near: {
            $geometry: { type: 'Point', coordinates: [longitude, latitude] },
            $maxDistance: radius,
          },
        },
      })
      .limit(limit);

    return posts.map((post) => ({
      post,
      locationName,
    }));
  }

  async getPostById(postId: string): Promise<PostEntity> {
    const post = await this.postModel.findById(postId);
    if (!post) {
      throw new PostNotFoundException(postId);
    }
    return post;
  }
}
