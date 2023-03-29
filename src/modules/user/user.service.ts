import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserI } from '../../shared/interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserI>,
  ) {}

  getProfile(user: UserI) {
    try {
      return {
        email: user.email,
        username: user.username,
        score: user.score,
        role: user.role,
      };
    } catch (err) {
      throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
    }
  }
}
