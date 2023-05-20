import { Injectable } from '@nestjs/common';
import { IUser } from '@/common/interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from '../tasks/schemas/task.schema';
import { ITask } from '@/common/interfaces/task.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<ITask>,
  ) {}

  async getProfile(user: IUser) {
    const tasks = await this.taskModel.find({ 'author.id': user._id });

    return {
      email: user.email,
      username: user.username,
      score: user.score,
      role: user.role,
      tasks,
    };
  }
}
