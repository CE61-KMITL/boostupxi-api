import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { IFile } from '@/common/interfaces/file.interface';
import { StatusType } from '@/common/interfaces/task.interface';
import { ITestCase } from '@/common/interfaces/testcase.interface';
import { TaskStatus } from '../../../common/enums/task-status.enum';
import { IAuthor } from '@/common/interfaces/task.interface';
import { IComment } from '@/common/interfaces/comment.interface';

const AuthorSchema = raw({
  id: { type: Types.ObjectId, required: true, ref: 'User' },
  username: { type: String, required: true },
});

@Schema({ timestamps: true })
export class Task extends Document {
  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, type: AuthorSchema })
  author: IAuthor;

  @Prop({ required: true, min: 1, max: 5 })
  level: number;

  @Prop({ required: true })
  tags: string[];

  @Prop({ default: '' })
  hint: string;

  @Prop({ default: [] })
  files: IFile[];

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
}

export const TaskSchema = SchemaFactory.createForClass(Task);
