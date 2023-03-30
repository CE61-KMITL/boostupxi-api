import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './schemas/task.schema';
import { TaskI } from 'src/shared/interfaces/task.interface';
import { CreateTaskDto } from './dto/create-task.dto';
import { UserI } from '../../shared/interfaces/user.interface';
import { Role } from 'src/shared/enums/role.enum';
import { AwsService } from '../aws/aws.service';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskI>,
    private awsService: AwsService,
  ) {}

  async createTask(createTaskDto: CreateTaskDto, user: UserI): Promise<TaskI> {
    const task = await this.taskModel.findOne({
      title: createTaskDto.title,
    });

    if (task) {
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
  }

  async getTasks(): Promise<TaskI[]> {
    const tasks = await this.taskModel.find({});
    return tasks;
  }

  async getTaskById(id: string): Promise<TaskI> {
    const task = await this.taskModel.findById(id);

    if (!task) {
      throw new HttpException('TASK_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    return task;
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.taskModel.findById(id);

    if (!task) {
      throw new HttpException('TASK_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    const updatedTask = await this.taskModel.findByIdAndUpdate(
      id,
      updateTaskDto,
      { new: true },
    );

    return updatedTask;
  }

  async deleteTask(id: string, user: UserI) {
    const task = await this.taskModel.findById(id);
    if (
      task &&
      (user.role === Role.AUDITOR ||
        (user.role === Role.STAFF &&
          task.author.id.toString() === user._id.toString()))
    ) {
      const keys = task.files.map((file) => ({ key: file.key }));
      await this.awsService.deleteFiles(keys);
      await task.delete();
      throw new HttpException('TASK_DELETED', HttpStatus.OK);
    }
    throw new HttpException('TASK_NOT_FOUND', HttpStatus.NOT_FOUND);
  }
}
