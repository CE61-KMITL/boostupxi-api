import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { IFile } from 'src/shared/interfaces/file.interface';
import { StatusType } from 'src/shared/interfaces/task.interface';
import { ITestCase } from 'src/shared/interfaces/testcase.interface';
import { TaskStatus } from '../enum/task-status.enum';
import { IAuthor } from '../../../shared/interfaces/task.interface';

@Schema({ timestamps: true })
export class Task extends Document {
  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop(
    raw({
      id: { type: Types.ObjectId, ref: 'User', required: true },
      username: { type: String, required: true },
    }),
  )
  author: IAuthor;

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

  @Prop({ default: TaskStatus.Queued })
  status: StatusType;

  @Prop({ required: true })
  solution_code: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
