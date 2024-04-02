import { PostEntity } from 'src/schemas/Post.schema';
import { CreatePostDetails } from 'src/utils/types';

export interface IPostService {
  createPost({
    userId,
    ...createPostsDto
  }: CreatePostDetails): Promise<PostEntity>;

  getPosts(
    userId: string,
    sortBy?: 'asc' | 'desc',
    page?: number,
    limit?: number,
  ): Promise<PostEntity[]>;
}
