import { Document, Types } from 'mongoose';
import { Role } from '../enums/role.enum';
import { ITaskResponse } from './task.interface';

export interface IUser extends Document {
  email: string;
  username: string;
  password?: string;
  score: number;
  role: Role;
  group: string;
  createdAt: Date;
  updatedAt: Date;
  completedQuestions: Types.ObjectId[];
}

export interface IUserResponse {
  _id: string;
  email: string;
  username: string;
  score: number;
  group: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  tasks: ITaskResponse[];
  completedQuestionsCount: number;
}
