import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class PostEntity extends Document {
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  contents: string;
}

export const postSchema = SchemaFactory.createForClass(PostEntity);
