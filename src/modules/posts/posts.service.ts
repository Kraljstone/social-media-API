import { Injectable, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostEntity } from 'src/schemas/Post.schema';
import { User } from 'src/schemas/User.schema';
import { MentionsAndHashtagsEntity } from 'src/schemas/MentionsAndHashtags.schema';
import { CreatePostDto } from './dto/create-post.dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(PostEntity.name) private readonly postModel: Model<PostEntity>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(MentionsAndHashtagsEntity.name)
    private readonly mentionsAndHashtagsModel: Model<MentionsAndHashtagsEntity>,
  ) {}

  async createPost(createPostDto: CreatePostDto) {
    const { contents } = createPostDto;

    // Extract mentions and hashtags
    const mentions = await this.extractMentions(contents);
    const hashtags = this.extractHashtags(contents);

    // Create a new MentionsAndHashtagsEntity
    const mentionsAndHashtags = new this.mentionsAndHashtagsModel({
      contents,
      mentions,
      hashtags,
    });

    await mentionsAndHashtags.save();

    // Create and save the new post
    const newPost = new this.postModel({
      ...createPostDto,
      mentionsAndHashtags: mentionsAndHashtags._id, // Store the reference to the mentions and hashtags
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

    const mentionedUsers = await this.userModel
      .find({ username: { $in: mentionedUsernames } })
      .exec();

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

    if (!findUser) throw new HttpException('User Not Found', 404);

    const skip = (page - 1) * limit;

    let query = this.postModel.find().populate('mentionsAndHashtags'); // Populating mentions and hashtags

    if (sortBy) {
      const sortOrder = sortBy === 'desc' ? -1 : 1;
      query = query.sort({ createdAt: sortOrder });
    }

    query = query.skip(skip).limit(limit);

    return query.exec();
  }
}
