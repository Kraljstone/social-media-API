import {
  Body,
  Controller,
  Post,
  Get,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { CreatePostsDto } from './dto/create-posts.dto/create-posts.dto';
import { PostsService } from './posts.service';
import { PostEntity } from 'src/schemas/Post.schema';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  createPost(@Body() createPostsDto: CreatePostsDto) {
    this.postsService.createPost(createPostsDto);
    return { message: 'Post created successfully' };
  }

  @Get()
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
