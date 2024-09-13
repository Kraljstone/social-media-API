import { Injectable } from '@nestjs/common';

@Injectable()
export class HashtagsService {
  extractHashtags(content: string): string[] {
    const hashtagRegex = /#(\w+)/g;
    return Array.from(content.matchAll(hashtagRegex)).map((match) => match[1]);
  }
}
