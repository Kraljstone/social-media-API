import {
  Controller,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { AuthenticatedGuard } from 'src/auth/guards/local.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Routes } from 'src/utils/constants';
import { Services } from 'src/utils/constants';
import { ILikesService } from '../posts';

@Controller(Routes.POSTS)
@UseGuards(AuthenticatedGuard)
@UseGuards(JwtAuthGuard)
export class LikesController {
  constructor(
    @Inject(Services.LIKES) private readonly likesService: ILikesService,
  ) {}

  // @route POST /posts/:postId/like
  @Post(':postId/like')
  async likePost(
    @Param('postId') postId: string,
    @Body('user') userId: string,
  ) {
    console.log(postId, userId, 'Log to ensure values are being passed');
    return this.likesService.likePost(postId, userId);
  }

  // @route DELETE /posts/:postId/unlike
  @Delete(':postId/unlike')
  async unlikePost(
    @Param('postId') postId: string,
    @Body('user') userId: string,
  ): Promise<{ message: string }> {
    await this.likesService.unlikePost(postId, userId);
    return { message: 'Post unliked successfully' };
  }
}
