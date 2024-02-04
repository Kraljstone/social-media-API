import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Post {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  contents: string;
}

export const postSchema = SchemaFactory.createForClass(Post);
