import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { IFile } from 'src/shared/interfaces/file.interface';
import { TStatus } from 'src/shared/interfaces/task.interface';
import { ITestCase } from 'src/shared/interfaces/testcase.interface';

@Schema({ timestamps: true })
export class Task extends Document {
  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  author: Types.ObjectId;

  @Prop({ required: true, min: 1, max: 5 })
  level: number;

  @Prop({ required: true })
  tags: string[];

  @Prop({ required: true })
  hint: string;

  @Prop({ required: true })
  files: IFile[];

  @Prop({ required: true })
  testcases: ITestCase[];

  @Prop({ default: true })
  draft: boolean;

  @Prop({ default: 'queue' })
  status: TStatus;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
