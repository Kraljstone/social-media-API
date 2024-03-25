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

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  createPost(@Body() createPostsDto: CreatePostsDto) {
    this.postsService.createPost(createPostsDto);
  }

  @Get()
  @UsePipes(new ValidationPipe())
  getPosts(
    @Body('userId') userId: string,
    @Query('sortBy') sortBy?: 'asc' | 'desc',
  ) {
    return this.postsService.getPosts(userId, sortBy);
  }
}
