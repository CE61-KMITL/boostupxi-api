import { Document } from 'mongoose';
import { IFile } from './file.interface';
import { ITestCase } from './testcase.interface';
import { IComment } from './comment.interface';

export type StatusType = 'queue' | 'approve' | 'reject';

export interface IAuthor {
  id: string;
  username: string;
}

export interface ITask extends Document {
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
  comments: IComment[];
}
