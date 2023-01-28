import { Document } from 'mongoose';
import { Role } from 'src/shared/enums/role.enum';

export interface UserI extends Document {
  email: string;
  username: string;
  password: string;
  score: number;
  role: Role;
}