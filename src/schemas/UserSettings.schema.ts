import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose } from 'class-transformer';

@Schema()
export class UserSettings {
  @Prop({ required: false })
  @Expose()
  receiveNotifications?: boolean;

  @Prop({ required: false })
  @Expose()
  receiveEmails?: boolean;

  @Prop({ required: false })
  @Expose()
  receiveSMS?: boolean;
}

export const userSettingsSchema = SchemaFactory.createForClass(UserSettings);
