import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserI } from '../../shared/interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { Task } from '../tasks/schemas/task.schema';
import { TaskI } from 'src/shared/interfaces/task.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserI>,
    @InjectModel(Task.name) private readonly taskModel: Model<TaskI>,
  ) {}

  async getProfile(user: UserI) {
    try {
      const tasks = await this.taskModel.find({ 'author.id': user._id });

      return {
        email: user.email,
        username: user.username,
        score: user.score,
        role: user.role,
        tasks,
      };
    } catch (err) {
      throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
    }
  }
}
