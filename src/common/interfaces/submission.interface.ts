import { Types } from 'mongoose';

export interface ISubmission {
  user?: Types.ObjectId;
  question?: Types.ObjectId;
  source_code: string;
  result: string;
  status: boolean;
}
