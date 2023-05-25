import { Document } from 'mongoose';

export interface IFile extends Document {
  url: string;
  key: string;
  owner?: string;
}
