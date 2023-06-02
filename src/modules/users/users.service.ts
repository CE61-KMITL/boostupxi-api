import {
  HttpException,
  HttpExceptionOptions,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { IUser, IUserResponse } from '@/common/interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { TasksService } from '../tasks/tasks.service';
import { Task } from '../tasks/schemas/task.schema';
import { ITask } from '@/common/interfaces/task.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<IUser>,
    @InjectModel(Task.name) private readonly taskModel: Model<ITask>,
    private tasksService: TasksService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  async getProfile(user: IUser): Promise<IUserResponse> {
    const tasks = await this.taskModel.find({ author: user._id });

    const formattedTasks = tasks.map((task) =>
      this.tasksService.formattedTaskData(task),
    );

    return {
      _id: user._id,
      email: user.email,
      username: user.username,
      score: user.score,
      role: user.role,
      group: user.group,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      tasks: await Promise.all(formattedTasks),
      rank: 0,
      completedQuestionsCount: user.completedQuestions.length,
    };
  }

  async update(
    id: string,
    user: IUser,
    updateUserDto: UpdateUserDto,
  ): Promise<HttpExceptionOptions> {
    if (id !== user._id.toString()) {
      throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
    }

    const userExist = await this.userModel.findById(id);

    if (!userExist) {
      throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    if (updateUserDto.username && user.username !== updateUserDto.username) {
      const usernameExists = await this.userModel.findOne({
        username: updateUserDto.username,
      });

      if (usernameExists) {
        throw new HttpException('USERNAME_EXISTS', HttpStatus.BAD_REQUEST);
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await this.hashPassword(updateUserDto.password);
    }

    await this.userModel.findByIdAndUpdate(
      id,
      { ...updateUserDto },
      {
        new: true,
        select: '-password',
      },
    );

    throw new HttpException('USER_UPDATED', HttpStatus.OK);
  }
}
