import { Document, Types } from 'mongoose';
import { IFile } from './file.interface';
import { ITestCase } from './testcase.interface';
import { IComment } from './comment.interface';

export type StatusType = 'queued' | 'approved' | 'rejected';

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
  status: StatusType;
  solution_code: string;
  comments: IComment[];
  purchased_hint: Types.ObjectId[];
  passedBy: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ITaskResponse {
  _id: string;
  title: string;
  description: string;
  author: {
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
  createdAt: Date;
  updatedAt: Date;
}

export interface ITaskResponseWithPagination {
  pages: number;
  data: ITaskResponse[];
  currentPage: number;
}