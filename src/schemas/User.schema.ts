import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { UserSettings } from './UserSettings.schema';
import { PostEntity } from './Post.schema';
import { Exclude, Expose } from 'class-transformer';

@Schema()
export class User {
  @Prop({ overwrite: false })
  @Expose()
  _id: string;

  @Prop({ unique: true, required: true })
  @Expose()
  username: string;

  @Prop({ required: true })
  @Exclude()
  password: string;

  @Prop({ required: false })
  @Expose()
  displayName?: string;

  @Prop({ required: false })
  @Expose()
  avatarUrl?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'UserSettings' })
  @Expose()
  settings?: UserSettings;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PostEntity' }] })
  @Expose()
  posts: PostEntity[];
}

export const userSchema = SchemaFactory.createForClass(User);
