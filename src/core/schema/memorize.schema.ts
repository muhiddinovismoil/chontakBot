import * as mongo from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Media } from '@/common';
import { User } from './user.schema';

@Schema()
export class Memorize {
  @Prop({ name: 'content', type: String })
  content: string;

  @Prop({ name: 'key', type: String })
  key: string;

  @Prop({ name: 'type', enum: Media })
  type: Media;

  @Prop({ type: mongo.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const MemorizeSchema = SchemaFactory.createForClass(Memorize);
