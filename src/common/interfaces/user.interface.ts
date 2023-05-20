import { Document } from 'mongoose';
import { Role } from '../enums/role.enum';

export interface IUser extends Document {
  email: string;
  username: string;
  password: string;
  score: number;
  role: Role;
}
