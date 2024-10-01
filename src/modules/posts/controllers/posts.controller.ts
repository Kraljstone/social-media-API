import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  Inject,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreatePostDto } from '../dto/create-post.dto/create-post.dto';
import { IPostsService } from '../posts';
import { PostEntity } from 'src/schemas/Post.schema';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Routes, Services } from 'src/utils/constants';
import { AuthenticatedGuard } from 'src/auth/guards/local.guard';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Controller(Routes.POSTS)
@UseGuards(AuthenticatedGuard)
@UseGuards(JwtAuthGuard)
export class PostsController {
  constructor(
    @Inject(Services.POSTS) private postsService: IPostsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  // @route POST api/posts
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async createPost(
    @Body() createPostDto: CreatePostDto,
  ): Promise<{ message: string; post: any }> {
    const post = await this.postsService.createPost(createPostDto);

    const formattedPost = {
      title: post.title,
      contents: post.contents,
      location: post.location,
      _id: post._id,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };

    return { message: 'Post created successfully', post: formattedPost };
  }

  // @route GET api/posts/near?longitude=123&latitude=123&radius=123
  @Get('/near')
  async getPostsNearLocation(
    @Query('longitude') longitude: number,
    @Query('latitude') latitude: number,
    @Query('radius') radius: number,
  ): Promise<{ post: PostEntity; locationName: string }[]> {
    const cacheKey = `posts_near_${longitude}_${latitude}_${radius}`;

    // Check if posts are in cache
    const cachedPosts =
      await this.cacheManager.get<{ post: PostEntity; locationName: string }[]>(
        cacheKey,
      );
    if (cachedPosts) {
      return cachedPosts;
    }

    // If not cached, fetch from service
    const posts = await this.postsService.getPostsNearLocation(
      longitude,
      latitude,
      radius,
    );

    // Cache the fetched posts
    await this.cacheManager.set(cacheKey, posts, 600);

    return posts;
  }
}
