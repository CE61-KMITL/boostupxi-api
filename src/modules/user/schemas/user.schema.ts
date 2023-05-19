import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '@/shared/enums/role.enum';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 0 })
  score: number;

  @Prop({ default: Role.User })
  role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);
