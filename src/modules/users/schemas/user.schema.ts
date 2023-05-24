import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '@/common/enums/role.enum';
import { Group } from '@/common/enums/group.enum';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true, maxLength: 20, minlength: 3 })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 0 })
  score: number;

  @Prop({ default: Role.User })
  role: Role;

  @Prop({ required: Group.None })
  group: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
