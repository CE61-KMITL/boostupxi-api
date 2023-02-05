import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './schemas/task.schema';
import { ITask } from 'src/shared/interfaces/task.interface';
import { CreateTaskDto } from './dto/create-task.dto';
import { Role } from 'src/shared/enums/role.enum';
import { UpdateAuditTaskDto } from './dto/update-audit-task.dto';
import { IUser } from 'src/shared/interfaces/user.interface';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AwsService } from '../aws/aws.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<ITask>,
    private awsService: AwsService,
  ) {}

  async createTask(
    createTaskDto: CreateTaskDto,
    user_id: string,
    files: Array<Express.Multer.File>,
  ): Promise<ITask> {
    try {
      const uploadFiles = await this.awsService.uploadFiles(files);

      const uploadFilesUrl = uploadFiles.map((file) => {
        return {
          url: file.Location,
          key: file.Key,
        };
      });

      const task = await this.taskModel.create({
        ...createTaskDto,
        author: user_id,
        files: uploadFilesUrl,
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

  async updateTaskById(
    taskId: string,
    user: IUser,
    updateTaskDto: UpdateTaskDto,
    files: Array<Express.Multer.File>,
  ): Promise<ITask> {
    try {
      const task = await this.taskModel.findById(taskId);

      if (
        task &&
        (user.role === Role.AUDITOR ||
          (user.role === Role.STAFF &&
            task.author.toString() === user._id.toString()))
      ) {
        const updateFilesUpload = await this.awsService.updateFiles(
          task.files,
          files,
        );

        const updateFilesUrl = updateFilesUpload.map((file) => {
          return {
            url: file.Location,
            key: file.Key,
          };
        });

        const updateTask = await this.taskModel.findByIdAndUpdate(
          taskId,
          {
            ...updateTaskDto,
            files: updateFilesUrl,
          },
          {
            new: true,
          },
        );
        return updateTask;
      }

      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    } catch (error) {
      throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
    }
  }

  async updateAuditTaskById(
    id: string,
    auditTaskDto: UpdateAuditTaskDto,
  ): Promise<ITask> {
    try {
      const newTask = await this.taskModel.findByIdAndUpdate(id, auditTaskDto, {
        new: true,
      });
      return newTask;
    } catch (error) {
      throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
    }
  }

  async deleteTaskById(taskId: string, user: IUser) {
    const task = await this.taskModel.findById(taskId);
    if (
      task &&
      (user.role === Role.AUDITOR ||
        (user.role === Role.STAFF &&
          task.author.toString() === user._id.toString()))
    ) {
      await this.awsService.deleteFiles(task.files);
      await this.taskModel.findByIdAndDelete(taskId);
      throw new HttpException('DELETED', HttpStatus.OK);
    }
    throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
  }
}
