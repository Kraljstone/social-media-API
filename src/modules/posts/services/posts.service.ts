import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
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

    console.log(contents);

    const mentions = await this.mentionsService.extractMentions(contents);
    const hashtags = this.hashtagsService.extractHashtags(contents);

    const newMentionsAndHashtags = new this.mentionsAndHashtagsModel({
      contents,
      mentions: mentions || [],
      hashtags: hashtags || [],
    });
    await newMentionsAndHashtags.save();

    // Create and save the new post
    const newPost = new this.postModel({
      ...createPostDto,
      mentionsAndHashtags: newMentionsAndHashtags._id,
      ...(location && { location: { type: 'Point', coordinates: location } }),
    });

    await newPost.save();

    return newPost;
  }

  async getPosts(
    userId: string,
    sortBy?: 'asc' | 'desc',
    page?: number,
    limit?: number,
  ) {
    const findUser = await this.userModel.findById(userId);

    if (!findUser) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }

    const skip = (page - 1) * limit;

    // Query posts and populate mentions and hashtags
    let query = this.postModel.find().populate({
      path: 'mentionsAndHashtags',
      populate: {
        path: 'mentions',
        select: 'username',
      },
    });

    if (sortBy) {
      const sortOrder = sortBy === 'desc' ? -1 : 1;
      query = query.sort({ createdAt: sortOrder });
    }

    query = query.skip(skip).limit(limit);

    return query.exec();
  }

  async getPostsNearLocation(
    longitude: number,
    latitude: number,
    radius: number,
  ): Promise<{ post: PostEntity; locationName: string }[]> {
    const locationName = await getLocationName(longitude, latitude);

    const posts = await this.postModel.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [longitude, latitude] },
          $maxDistance: radius,
        },
      },
    });

    return posts.map((post) => ({
      post,
      locationName,
    }));
  }
}
