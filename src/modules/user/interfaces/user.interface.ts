import { Document } from 'mongoose';

export interface UserI extends Document {
  email: string;
  username: string;
  password: string;
  score: number;
  role: string;
  finished: number;
}
