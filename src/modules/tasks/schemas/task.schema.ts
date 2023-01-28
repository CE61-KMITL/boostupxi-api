import { Type } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { StatusT } from 'src/shared/interfaces/task.interface';
import { TestCaseI } from 'src/shared/interfaces/testcase.interface';

@Schema()
export class Task extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  author: Types.ObjectId;

  @Prop({ required: true,min: 1,max: 5 })
  level: number;

  @Prop({ required: true })
  tags: string[];

  @Prop({ required: true })
  hint: string;

  @Prop({ required: true })
  files: string[];

  @Prop({ required: true })
  testcases: TestCaseI[];

  @Prop({ default: true })
  draft: boolean;

  @Prop({ default: 'queue' })
  status: StatusT;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
