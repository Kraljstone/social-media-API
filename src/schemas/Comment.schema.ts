import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { PostEntity } from './Post.schema';
import { User } from './User.schema';

@Schema({ timestamps: true })
export class Comment extends Document {
  @Prop({ type: Types.ObjectId, ref: 'PostEntity', required: true })
  post: PostEntity;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ type: String, required: true })
  text: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
