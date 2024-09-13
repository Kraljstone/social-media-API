import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { PostEntity } from './Post.schema';
import { User } from './User.schema';

@Schema({ timestamps: true })
export class Like extends Document {
  @Prop({ type: Types.ObjectId, ref: 'PostEntity', required: true })
  post: PostEntity;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User;
}

export const LikeSchema = SchemaFactory.createForClass(Like);

LikeSchema.index({ post: 1, user: 1 }, { unique: true });
