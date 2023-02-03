import { Document, Types } from 'mongoose';
import { IFile } from './file.interface';
import { ITestCase } from './testcase.interface';

export type TStatus = 'queue' | 'approve' | 'reject';

export interface ITask extends Document {
  title: string;
  description: string;
  author: Types.ObjectId;
  level: number;
  tags: string[];
  hint: string;
  files: IFile[];
  testcases: ITestCase[];
  draft: boolean;
  status: TStatus;
}
