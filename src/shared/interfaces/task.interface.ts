import { Document, Types } from 'mongoose';
import { TestCaseI } from './testcase.interface';

export type StatusT = 'queue' | 'approve' | 'reject';

export interface TaskI extends Document {
  title: string;
  description: string;
  author: Types.ObjectId;
  level: number;
  tags: string[];
  hint: string;
  files: string[];
  testcases: TestCaseI[];
  draft: boolean;
  status: StatusT;
}
