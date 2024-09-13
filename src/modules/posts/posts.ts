import { PostEntity } from 'src/schemas/Post.schema';
import { CreatePostDetails } from 'src/utils/types';
import { User } from 'src/schemas/User.schema';
import { Like } from 'src/schemas/Like.schema';
import { Comment } from 'src/schemas/Comment.schema';

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

export interface IMentionsService {
  extractMentions(content: string): Promise<User[]>;
}

export interface IHashtagsService {
  extractHashtags(content: string): string[];
}

export interface ILikesService {
  likePost(postId: string, userId: string): Promise<Like>;

  unlikePost(postId: string, userId: string): Promise<void>;
}

export interface ICommentsService {
  addComment(postId: string, userId: string, text: string): Promise<Comment>;
  editComment(
    commentId: string,
    userId: string,
    text: string,
  ): Promise<Comment>;
  deleteComment(commentId: string, userId: string): Promise<void>;
}
