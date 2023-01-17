import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from 'src/auth/interface/role.enum';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 0 })
  score: number;

  @Prop({ default: Role.USER })
  role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);
