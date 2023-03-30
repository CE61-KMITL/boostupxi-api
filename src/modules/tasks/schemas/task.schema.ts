import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { FileI } from 'src/shared/interfaces/file.interface';
import { StatusT } from 'src/shared/interfaces/task.interface';
import { TestCaseI } from 'src/shared/interfaces/testcase.interface';
import { TaskStatus } from '../enum/task-status.enum';
import { AuthorI } from '../../../shared/interfaces/task.interface';

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
  author: AuthorI;

  @Prop({ required: true, min: 1, max: 5 })
  level: number;

  @Prop({ required: true })
  tags: string[];

  @Prop({ required: true })
  hint: string;

  @Prop({ required: true })
  files: FileI[];

  @Prop({ required: true })
  testcases: TestCaseI[];

  @Prop({ default: true })
  draft: boolean;

  @Prop({ default: TaskStatus.QUEUE })
  status: StatusT;

  @Prop({ required: true })
  solution_code: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
