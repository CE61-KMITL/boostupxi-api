import { IAuthor } from './task.interface';

export interface IComment {
  message: string;
  author: IAuthor;
  createdAt: Date;
  updatedAt: Date;
  id: string;
}
