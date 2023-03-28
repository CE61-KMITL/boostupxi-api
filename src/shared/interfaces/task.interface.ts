import { Document, Types } from 'mongoose';
import { FileI } from './file.interface';
import { TestCaseI } from './testcase.interface';

export type StatusT = 'queue' | 'approve' | 'reject';

export interface ITask extends Document {
  title: string;
  description: string;
  author: Types.ObjectId;
  level: number;
  tags: string[];
  hint: string;
  files: FileI[];
  testcases: TestCaseI[];
  draft: boolean;
  status: StatusT;
  solution_code: string;
}
