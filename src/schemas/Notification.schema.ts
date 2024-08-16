import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';
import { User } from './User.schema';

@Schema()
export class Notification extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
