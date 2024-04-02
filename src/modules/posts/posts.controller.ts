import {
  Body,
  Controller,
  Post,
  Get,
  UsePipes,
  ValidationPipe,
  Query,
  Inject,
} from '@nestjs/common';
import { CreatePostsDto } from './dto/create-posts.dto/create-posts.dto';
import { PostsService } from './posts.service';
import { PostEntity } from 'src/schemas/Post.schema';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Routes } from 'src/utils/constants';
import { Services } from 'src/utils/constants';

@Controller(Routes.POSTS)
export class PostsController {
  constructor(@Inject(Services.POSTS) private postsService: PostsService) {}

  // @route  api/posts

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  createPost(@Body() createPostsDto: CreatePostsDto): { message: string } {
    this.postsService.createPost(createPostsDto);
    return { message: 'Post created successfully' };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  getPosts(
    @Body('userId') userId: string,
    @Query('sortBy') sortBy?: 'asc' | 'desc',
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<PostEntity[]> {
    return this.postsService.getPosts(userId, sortBy, page, limit);
  }
}
