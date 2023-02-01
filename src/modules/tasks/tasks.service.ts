import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './schemas/task.schema';
import { ITask } from 'src/shared/interfaces/task.interface';
import { CreateTaskDto } from './dto/create-task.dto';
import { Role } from 'src/shared/enums/role.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<ITask>,
  ) {}

  async createTask(
    createTaskDto: CreateTaskDto,
    user_id: string,
  ): Promise<ITask> {
    try {
      const task = await this.taskModel.create({
        ...createTaskDto,
        author: user_id,
      });
      return task;
    } catch (error) {
      throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
    }
  }

  async getTasks(): Promise<ITask[]> {
    return await this.taskModel.find();
  }

  async getTaskById(id: string): Promise<ITask> {
    return await this.taskModel.findById(id);
  }

  async deleteTaskById(id: string, role: string, user_id: string) {
    const task = await this.taskModel.findById(id);
    if (task) {
      if (role === Role.AUDITOR) {
        await this.taskModel.findByIdAndDelete(id);
        throw new HttpException('DELETED', HttpStatus.OK);
      }
      if (role === Role.STAFF && task.author.toString() === user_id) {
        await this.taskModel.findByIdAndDelete(id);
        throw new HttpException('DELETED', HttpStatus.OK);
      }
    }
    throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
  }
}
