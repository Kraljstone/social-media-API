import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { MentionsAndHashtagsEntity } from './MentionsAndHashtags.schema';
@Schema()
export class PostEntity extends Document {
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ required: true })
  title: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MentionsAndHashtagsEntity',
  })
  mentionsAndHashtags: MentionsAndHashtagsEntity;

  @Prop({ required: true })
  contents: string;
}

export const postSchema = SchemaFactory.createForClass(PostEntity);
