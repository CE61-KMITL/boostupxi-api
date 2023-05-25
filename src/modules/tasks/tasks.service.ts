import {
  HttpException,
  HttpStatus,
  Injectable,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './schemas/task.schema';
import { ITask } from '@/common/interfaces/task.interface';
import { CreateTaskDto } from './dtos/create-task.dto';
import { IUser } from '@/common/interfaces/user.interface';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { UpdateAuditTaskDto } from './dtos/update-audit-task.dto';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { UpdateCommentDto } from './dtos/update-comment.dto';
import { v4 as uuidv4 } from 'uuid';
import { UpdateDraftTaskDto } from './dtos/update-draft-task.dto';
import { UsersService } from '../users/users.service';
import { FilesService } from '../files/files.service';
import { IFile } from '@/common/interfaces/file.interface';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<ITask>,
    @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
    private filesService: FilesService,
  ) {}

  async findByAuthor(author: string): Promise<ITask[]> {
    return this.taskModel.find({ author });
  }

  async findOneByTitle(title: string): Promise<ITask> {
    return this.taskModel.findOne({ title });
  }

  async findById(id: string): Promise<ITask> {
    return this.taskModel.findById(id);
  }

  async formattedTaskData(task: ITask): Promise<ITask> {
    const user = await this.usersService.findById(task.author.toString());

    task.author = {
      username: user.username,
    };

    const comments = await Promise.all(
      task.comments.map(async (comment) => {
        const user = await this.usersService.findById(
          comment.author.toString(),
        );

        comment.author = {
          username: user.username,
        };

        return comment;
      }),
    );

    task.comments = comments;

    const fileKeys = await Promise.all(
      task.files.map(async (fileId) => {
        const file = await this.filesService.findById(fileId.toString());
        return { id: file._id, key: file.key, url: file.url } as IFile;
      }),
    );

    task.files = fileKeys;

    return task;
  }

  async create(createTaskDto: CreateTaskDto, user: IUser): Promise<ITask> {
    const task = await this.findOneByTitle(createTaskDto.title);

    if (task) {
      throw new HttpException('TASK_EXISTED', HttpStatus.BAD_REQUEST);
    }

    await this.taskModel.create({
      ...createTaskDto,
      author: user._id,
    });
    throw new HttpException('TASK_CREATED', HttpStatus.CREATED);
  }

  async getTasks(page = 1, limit = 25) {
    const tasks = await this.taskModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    const count = await this.taskModel.countDocuments();
    const pages = Math.ceil(count / limit);

    const formattedTasks = tasks.map((task) => this.formattedTaskData(task));

    return {
      currentPage: page,
      pages,
      data: await Promise.all(formattedTasks),
    };
  }

  async getTaskById(id: string): Promise<ITask> {
    const task = await this.findById(id);

    if (!task) {
      throw new HttpException('TASK_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    return this.formattedTaskData(task);
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, user: IUser) {
    const task = await this.findById(id);

    if (!task) {
      throw new HttpException('TASK_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    if (
      task.author.toString() !== user._id.toString() &&
      user.role !== 'admin'
    ) {
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
    }

    await this.taskModel.findByIdAndUpdate(id, updateTaskDto, { new: true });

    throw new HttpException('TASK_UPDATED', HttpStatus.OK);
  }

  async auditTask(
    id: string,
    updateAuditTaskDto: UpdateAuditTaskDto,
    user: IUser,
  ) {
    const task = await this.findById(id);

    if (
      task.status === 'approved' &&
      updateAuditTaskDto.status === 'approved'
    ) {
      throw new HttpException('TASK_IS_APPROVED', HttpStatus.BAD_REQUEST);
    }

    if (
      task.status === 'rejected' &&
      updateAuditTaskDto.status === 'rejected'
    ) {
      throw new HttpException('TASK_IS_REJECTED', HttpStatus.BAD_REQUEST);
    }

    if (!task.draft) {
      throw new HttpException('TASK_IS_PUBLISHED', HttpStatus.BAD_REQUEST);
    }

    if (!task) {
      throw new HttpException('TASK_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    if (task.author.toString() !== user._id.toString()) {
      await this.taskModel.findByIdAndUpdate(id, updateAuditTaskDto, {
        new: true,
      });
      throw new HttpException('TASK_AUDITED', HttpStatus.OK);
    } else {
      throw new HttpException(
        'CAN_NOT_AUDIT_YOUR_OWN_TASK',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async draftTask(id: string, updateDraftTaskDto: UpdateDraftTaskDto) {
    const task = await this.findById(id);

    if (!task) {
      throw new HttpException('TASK_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    if (task.status !== 'approved') {
      throw new HttpException('TASK_NOT_APPROVED', HttpStatus.BAD_REQUEST);
    }

    await this.taskModel.findByIdAndUpdate(id, updateDraftTaskDto, {
      new: true,
    });

    throw new HttpException('TASK_DRAFTED', HttpStatus.OK);
  }

  async deleteTask(id: string, user: IUser) {
    const task = await this.findById(id);

    if (!task) {
      throw new HttpException('TASK_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    if (
      task.author.toString() !== user._id.toString() &&
      user.role !== 'admin'
    ) {
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
    }

    const fileKeys = await Promise.all(
      task.files.map(async (fileId) => {
        const file = await this.filesService.findById(fileId.toString());
        return { key: file.key };
      }),
    );

    await this.taskModel.findByIdAndDelete(id);
    await this.filesService.deleteFiles(user, fileKeys);

    throw new HttpException('TASK_DELETED', HttpStatus.OK);
  }

  async createComment(
    id: string,
    user: IUser,
    createCommentDto: CreateCommentDto,
  ) {
    const task = await this.findById(id);

    if (!task) {
      throw new HttpException('TASK_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    const newComment = {
      ...createCommentDto,
      author: user._id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      id: uuidv4(),
    };

    await this.taskModel.findByIdAndUpdate(
      id,
      { $push: { comments: newComment } },
      { new: true },
    );

    throw new HttpException('COMMENT_CREATED', HttpStatus.OK);
  }

  async deleteComment(id: string, user: IUser, commentId: string) {
    const task = await this.findById(id);

    if (!task) {
      throw new HttpException('TASK_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    const comment = task.comments.find(
      (comment) => comment.id.toString() === commentId,
    );

    if (!comment) {
      throw new HttpException('COMMENT_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    if (comment.author.toString() !== user._id.toString()) {
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
    }

    const deletedComment = await this.taskModel.findByIdAndUpdate(
      id,
      { $pull: { comments: { id: commentId } } },
      { new: true },
    );

    if (!deletedComment) {
      throw new HttpException('COMMENT_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    throw new HttpException('TASK_DELETED', HttpStatus.OK);
  }

  async updateComment(
    id: string,
    user: IUser,
    updateCommentDto: UpdateCommentDto,
    commentId: string,
  ) {
    const task = await this.findById(id);

    if (!task) {
      throw new HttpException('TASK_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    const comment = task.comments.find(
      (comment) => comment.id.toString() === commentId,
    );

    if (!comment) {
      throw new HttpException('COMMENT_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    if (comment.author.toString() !== user._id.toString()) {
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
    }

    await this.taskModel.findByIdAndUpdate(
      id,
      {
        $set: {
          'comments.$[comment].message': updateCommentDto.message,
          'comments.$[comment].updatedAt': new Date().toISOString(),
        },
      },
      {
        arrayFilters: [{ 'comment.id': commentId }],
        new: true,
      },
    );

    throw new HttpException('COMMENT_UPDATED', HttpStatus.OK);
  }
}
