import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { MentionsAndHashtagsEntity } from './MentionsAndHashtags.schema';
import { Like } from './Like.schema';
import { Comment } from './Comment.schema';

@Schema({
  toJSON: { virtuals: true, versionKey: false },
  toObject: { virtuals: true },
  id: false,
  timestamps: true,
})
export class PostEntity extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  contents: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: MentionsAndHashtagsEntity.name,
    required: false,
  })
  mentionsAndHashtags?: Types.ObjectId | MentionsAndHashtagsEntity | null;

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  })
  location: {
    type: string; // Always 'Point' for GeoJSON
    coordinates: [number, number];
  };

  // Field to store location name
  @Prop({ required: false })
  locationName?: string;
  likesCount?: number;
  commentsCount?: number;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const postSchema = SchemaFactory.createForClass(PostEntity);

// Indexing the location field for geospatial queries
postSchema.index({ location: '2dsphere' });

// Virtuals for likes and comments
postSchema.virtual('likes', {
  ref: Like.name,
  localField: '_id',
  foreignField: 'post',
  justOne: false,
});

postSchema.virtual('comments', {
  ref: Comment.name,
  localField: '_id',
  foreignField: 'post',
  justOne: false,
});
