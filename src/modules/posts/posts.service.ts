import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostEntity } from 'src/schemas/Post.schema';
import { User } from 'src/schemas/User.schema';
import { MentionsAndHashtagsEntity } from 'src/schemas/MentionsAndHashtags.schema';
import { CreatePostDto } from './dto/create-post.dto/create-post.dto';
import { getLocationName } from './getLocationName';
import { IPostsService } from './posts';

@Injectable()
export class PostsService implements IPostsService {
  constructor(
    @InjectModel(PostEntity.name) private readonly postModel: Model<PostEntity>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(MentionsAndHashtagsEntity.name)
    private readonly mentionsAndHashtagsModel: Model<MentionsAndHashtagsEntity>,
  ) {}

  async createPost(createPostDto: CreatePostDto) {
    const { contents, location } = createPostDto;

    // Extract mentions and hashtags
    const mentions = await this.extractMentions(contents);
    const hashtags = this.extractHashtags(contents);

    // Create and save a new MentionsAndHashtagsEntity
    const mentionsAndHashtags = new this.mentionsAndHashtagsModel({
      contents,
      mentions,
      hashtags,
    });
    await mentionsAndHashtags.save();

    // Create and save the new post
    const newPost = new this.postModel({
      ...createPostDto,
      mentionsAndHashtags: mentionsAndHashtags._id, // Store reference to mentions and hashtags
      ...(location && { location: { type: 'Point', coordinates: location } }), // Add location if provided
    });

    await newPost.save();

    // Populate mentions and hashtags in the response
    return newPost.populate('mentionsAndHashtags'); // Populating the field
  }

  private async extractMentions(content: string): Promise<User[]> {
    const mentionRegex = /@(\w+)/g;
    const mentionedUsernames = Array.from(content.matchAll(mentionRegex)).map(
      (match) => match[1],
    );

    // Fetch users that are mentioned
    const mentionedUsers = await this.userModel
      .find({ username: { $in: mentionedUsernames } })
      .exec();

    // Error handling if no mentioned users are found
    if (mentionedUsers.length === 0) {
      throw new HttpException('No valid mentions found', HttpStatus.NOT_FOUND);
    }

    return mentionedUsers;
  }

  private extractHashtags(content: string): string[] {
    const hashtagRegex = /#(\w+)/g;
    return Array.from(content.matchAll(hashtagRegex)).map((match) => match[1]);
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
        path: 'mentions', // Populate the mentioned users' details (e.g., username)
        select: 'username', // Select only the username field
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
    const posts = await this.postModel.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [longitude, latitude] },
          $maxDistance: radius,
        },
      },
    });

    const locationName = await getLocationName(longitude, latitude);

    return posts.map((post) => ({
      post,
      locationName,
    }));
  }
}
