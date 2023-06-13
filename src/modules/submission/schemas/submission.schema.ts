import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Submission extends Document {
  @Prop({ required: true, ref: 'User' })
  user: Types.ObjectId;

  @Prop({ required: true, ref: 'Task' })
  question: Types.ObjectId;

  @Prop({ required: true })
  source_code: string;

  @Prop({ required: true })
  result: string;

  @Prop({ required: true })
  status: boolean;
}

export const SubmissionSchema = SchemaFactory.createForClass(Submission);
