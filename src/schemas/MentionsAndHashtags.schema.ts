import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/schemas/User.schema';

@Schema()
export class MentionsAndHashtagsEntity extends Document {
  @Prop({ required: true })
  contents: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  mentions: User[];

  @Prop({ type: [String] })
  hashtags: string[];
}

export const MentionsAndHashtagsSchema = SchemaFactory.createForClass(
  MentionsAndHashtagsEntity,
);
