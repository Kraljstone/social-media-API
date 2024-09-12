import { PostEntity } from 'src/schemas/Post.schema';
import { CreatePostDetails } from 'src/utils/types';

export interface IPostsService {
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

  getPostsNearLocation(
    longitude: number,
    latitude: number,
    radius: number,
  ): Promise<{ post: PostEntity; locationName: string }[]>;
}
