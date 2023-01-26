import { Document } from 'mongoose';
import { TestCaseI } from './testcase.interface';

export interface TaskI extends Document {
  title: string;
  description: string;
  author: string;
  level: number;
  tags: string[];
  hint: string;
  // files: string[];s
  testcases: TestCaseI[];
  draft: boolean;
  status: 'approve' | 'reject';
}
