import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';

export class Message {
  senderId: string;
  message: string;
  timestamp: Date;
}

@Schema()
export class ChatRoom extends Document {
  @Prop({ required: true })
  chatRoomName: string;

  @Prop({ type: [Types.ObjectId], required: true })
  participantIds: ObjectId[];

  @Prop({ type: [Message], default: [] })
  messages: Message[];
}

export const chatRoomSchema = SchemaFactory.createForClass(ChatRoom);
