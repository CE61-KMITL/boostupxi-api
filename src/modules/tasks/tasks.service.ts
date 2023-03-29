import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './schemas/task.schema';
import { TaskI } from 'src/shared/interfaces/task.interface';
import { CreateTaskDto } from './dto/create-task.dto';
import { UserI } from '../../shared/interfaces/user.interface';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskI>,
  ) {}

  async createTask(createTaskDto: CreateTaskDto, user: UserI): Promise<TaskI> {
    try {
      const task = await this.taskModel.findOne({
        title: createTaskDto.title,
      });

      if (task) {
        console.log('task existed');
        throw new HttpException('TASK_EXISTED', HttpStatus.BAD_REQUEST);
      }

      const newTask = await this.taskModel.create({
        ...createTaskDto,
        author: {
          id: user._id,
          username: user.username,
        },
      });
      return newTask;
    } catch (err) {
      console.log('err');
      throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
    }
  }

  async getTasks(): Promise<TaskI[]> {
    try {
      const tasks = await this.taskModel.find({});
      return tasks;
    } catch (err) {
      throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
    }
  }

  async getTask(id: string) {
    try {
      const task = await this.taskModel.findById(id);

      if (!task) {
        throw new HttpException('TASK_NOT_FOUND', HttpStatus.NOT_FOUND);
      }

      return task;
    } catch (err) {
      throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
    }
  }

  async updateTask(id: string) {
    try {
      return {
        message: `Task ${id} updated`,
      };
    } catch (err) {
      throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
    }
  }

  async deleteTask(id: string) {
    try {
      return {
        message: `Task ${id} deleted`,
      };
    } catch (err) {
      throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
    }
  }
}
