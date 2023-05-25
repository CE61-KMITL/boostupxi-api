import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class File extends Document {
  @Prop({ required: true, ref: 'User' })
  owner: Types.ObjectId;

  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  url: string;
}

export const FileSchema = SchemaFactory.createForClass(File);
