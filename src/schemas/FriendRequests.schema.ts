import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { User } from './User.schema';

@Schema()
export class FriendRequests extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' })
  sender: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' })
  receiver: User;

  @Prop({
    type: String,
    required: true,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  })
  status: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const friendRequestsSchema =
  SchemaFactory.createForClass(FriendRequests);
