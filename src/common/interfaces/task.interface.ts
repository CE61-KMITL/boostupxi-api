import { Document, Types } from 'mongoose';
import { IFile } from './file.interface';
import { ITestCase } from './testcase.interface';
import { IComment } from './comment.interface';

export type StatusType = 'queue' | 'approve' | 'reject';

export interface ITask extends Document {
  title: string;
  description: string;
  author:
    | Types.ObjectId
    | {
        id: Types.ObjectId;
        username: string;
      };
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
