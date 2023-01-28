import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './schemas/task.schema';
import { TaskI } from 'src/shared/interfaces/task.interface';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskI>,
  ) {}

  async createTask(createTaskDto: CreateTaskDto): Promise<TaskI> {
    try {
      return await this.taskModel.create(createTaskDto);
    } catch (error) {
      throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
    }
  }

  async getTasks(): Promise<TaskI[]> {
    return await this.taskModel
      .find()
      .select('-description -hint -files -testcases -draft')
      .exec();
  }

  async getTask(id: string): Promise<TaskI> {
    return await this.taskModel.findById(id).exec();
  }

  async updateTask(id: number, updateTaskDto: UpdateTaskDto) {
    return await `This action updates a #${id} task`;
  }

  deleteTask(id: number) {
    return `This action removes a #${id} task`;
  }
}
