import { Document } from 'mongoose';
import { Role } from '../../modules/authorization/enums/role.enum';

export interface IUser extends Document {
  email: string;
  username: string;
  password: string;
  score: number;
  role: Role;
}