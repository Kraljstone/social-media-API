import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/User.schema';
import { IMentionsService } from '../posts';

@Injectable()
export class MentionsService implements IMentionsService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async extractMentions(content: string): Promise<User[]> {
    const mentionRegex = /@(\w+)/g;
    const mentionedUsernames = Array.from(content.matchAll(mentionRegex)).map(
      (match) => match[1],
    );

    if (mentionedUsernames.length === 0) {
      return [];
    }

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
}
