import {
  Controller,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { ICommentsService } from '../posts';
import { AuthenticatedGuard } from 'src/auth/guards/local.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Routes } from 'src/utils/constants';
import { Services } from 'src/utils/constants';

@Controller(Routes.POSTS)
@UseGuards(AuthenticatedGuard)
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(
    @Inject(Services.COMMENTS)
    private readonly commentsService: ICommentsService,
  ) {}

  // @route POST /posts/:postId/comments
  @Post('/:postId/comments')
  async addComment(
    @Param('postId') postId: string,
    @Body('text') text: string,
    @Body('user') userId: string,
  ) {
    return this.commentsService.addComment(postId, userId, text);
  }

  // @route POST /posts/comments/:commentId/edit
  @Post('/comments/:commentId/edit')
  async editComment(
    @Param('commentId') commentId: string,
    @Body('text') text: string,
    @Body('user') userId: string,
  ) {
    return this.commentsService.editComment(commentId, userId, text);
  }

  // @route DELETE /posts/comments/:commentId
  @Delete('/comments/:commentId')
  async deleteComment(
    @Param('commentId') commentId: string,
    @Body('user') userId: string,
  ): Promise<{ message: string }> {
    await this.commentsService.deleteComment(commentId, userId);
    return { message: 'Comment deleted successfully' };
  }
}
