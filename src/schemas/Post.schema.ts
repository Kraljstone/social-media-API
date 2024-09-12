import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { MentionsAndHashtagsEntity } from './MentionsAndHashtags.schema';

@Schema()
export class PostEntity {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  contents: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MentionsAndHashtagsEntity',
  })
  mentionsAndHashtags: MentionsAndHashtagsEntity;

  // Geolocation field (GeoJSON Point format)
  @Prop({
    type: { type: String, enum: ['Point'], required: true }, // 'type' must be 'Point' for GeoJSON
    coordinates: { type: [Number], required: true }, // Coordinates must be an array of numbers [longitude, latitude]
  })
  location: {
    type: string; // Always 'Point' for GeoJSON
    coordinates: [number, number]; // [longitude, latitude]
  };

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const postSchema = SchemaFactory.createForClass(PostEntity);

// Ensure that MongoDB supports geospatial queries
postSchema.index({ location: '2dsphere' });
