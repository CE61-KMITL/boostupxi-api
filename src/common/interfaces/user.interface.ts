import { Document, Types } from 'mongoose';
import { Role } from '../enums/role.enum';
import { ITaskResponse } from './task.interface';

export interface IUser extends Document {
  email: string;
  username: string;
  password?: string;
  score: number;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  completedQuestions: Types.ObjectId[];
}

export interface IUserResponse {
  _id: string;
  email: string;
  username: string;
  score: number;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  tasks: ITaskResponse[];
  completedQuestionsCount: number;
}
