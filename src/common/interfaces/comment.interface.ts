import { Types } from 'mongoose';

export interface IComment {
  message: string;
  author:
    | Types.ObjectId
    | {
        username: string;
      };
  createdAt: Date;
  updatedAt: Date;
  id: string;
}
