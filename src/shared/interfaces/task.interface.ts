import { Document, Types } from 'mongoose';
import { ITestCase } from './testcase.interface';

export type TStatus = 'queue' | 'approve' | 'reject';

export interface ITask extends Document {
  title: string;
  description: string;
  author: Types.ObjectId;
  level: number;
  tags: string[];
  hint: string;
  files: string[];
  testcases: ITestCase[];
  draft: boolean;
  status: TStatus;
}
