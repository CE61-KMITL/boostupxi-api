import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { StatusType } from '@/common/interfaces/task.interface';
import { ITestCase } from '@/common/interfaces/testcase.interface';
import { TaskStatus } from '../../../common/enums/task-status.enum';
import { IComment } from '@/common/interfaces/comment.interface';

@Schema({ timestamps: true })
export class Task extends Document {
  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, ref: 'User' })
  author: Types.ObjectId;

  @Prop({ required: true, min: 1, max: 5 })
  level: number;

  @Prop({ required: true })
  tags: string[];

  @Prop({ default: '' })
  hint: string;

  @Prop({ default: [], ref: 'File' })
  files: Types.ObjectId[];

  @Prop({ required: true })
  testcases: ITestCase[];

  @Prop({ default: true })
  draft: boolean;

  @Prop({ default: TaskStatus.Queued })
  status: StatusType;

  @Prop({ required: true })
  solution_code: string;

  @Prop({ default: [] })
  comments: IComment[];

  @Prop({ default: [] })
  hint_user: Types.ObjectId[];
}

export const TaskSchema = SchemaFactory.createForClass(Task);
