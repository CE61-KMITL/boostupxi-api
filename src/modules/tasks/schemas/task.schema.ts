import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TestCaseI } from 'src/shared/interfaces/testcase.interface';

export class Task extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  hint: string;

  @Prop({ required: true, ref: 'User' })
  author: Types.ObjectId;

  @Prop({ required: true })
  test_cases: TestCaseI[];

  @Prop({ required: true })
  level: number;

  @Prop({ required: true })
  publish: boolean;
}
