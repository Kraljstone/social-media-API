import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  Inject,
  Get,
  Query,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto/create-post.dto';
import { IPostsService } from './posts';
import { PostEntity } from 'src/schemas/Post.schema';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Routes, Services } from 'src/utils/constants';
import { AuthenticatedGuard } from 'src/auth/guards/local.guard';

@Controller(Routes.POSTS)
@UseGuards(AuthenticatedGuard)
@UseGuards(JwtAuthGuard)
export class PostsController {
  constructor(@Inject(Services.POSTS) private postsService: IPostsService) {}

  // @route POST api/posts
  @Post()
  @UsePipes(new ValidationPipe())
  async createPost(
    @Body() createPostDto: CreatePostDto,
  ): Promise<{ message: string; post: PostEntity }> {
    const post = await this.postsService.createPost(createPostDto);
    return { message: 'Post created successfully', post };
  }

  // @route GET api/posts/near?longitude=123&latitude=123&radius=123
  @Get('/near')
  async getPostsNearLocation(
    @Query('longitude') longitude: number,
    @Query('latitude') latitude: number,
    @Query('radius') radius: number,
  ): Promise<{ post: PostEntity; locationName: string }[]> {
    return this.postsService.getPostsNearLocation(longitude, latitude, radius);
  }
}
