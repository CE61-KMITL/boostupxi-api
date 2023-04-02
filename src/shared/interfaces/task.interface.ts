import { Document } from 'mongoose';
import { IFile } from './file.interface';
import { ITestCase } from './testcase.interface';

export type StatusType = 'queue' | 'approve' | 'reject';

export interface IAuthor {
  id: string;
  username: string;
}

export interface TaskI extends Document {
  title: string;
  description: string;
  author: IAuthor;
  level: number;
  tags: string[];
  hint: string;
  files: IFile[];
  testcases: ITestCase[];
  draft: boolean;
  status: StatusType;
  solution_code: string;
}
