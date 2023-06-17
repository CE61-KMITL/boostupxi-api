import { IFile } from '@/common/interfaces/file.interface';
import {
  ITask,
  ITaskResponse,
  ITaskResponseWithPagination,
} from '@/common/interfaces/task.interface';
import { IUser } from '@/common/interfaces/user.interface';
import {
  HttpException,
  HttpExceptionOptions,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateAuditTaskDto } from './dtos/update-audit-task.dto';
import { UpdateCommentDto } from './dtos/update-comment.dto';
import { UpdateDraftTaskDto } from './dtos/update-draft-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { Task } from './schemas/task.schema';
import { ITestCase } from '@/common/interfaces/testcase.interface';
import { DiscordService } from '../discord/discord.service';
import { User } from '../users/schemas/user.schema';
import { File } from '../files/schemas/file.schema';
import { FilesService } from '../files/files.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<ITask>,
    @InjectModel(User.name) private readonly userModel: Model<IUser>,
    @InjectModel(File.name) private readonly fileModel: Model<IFile>,
    private discordService: DiscordService,
    private filesService: FilesService,
  ) {}

  async formattedTaskData(task: ITask): Promise<ITaskResponse> {
    const user = await this.userModel.findById(task.author.toString());

    const comments = await Promise.all(
      task.comments.map(async (comment) => {
        const user = await this.userModel.findById(comment.author.toString());

        comment.author = {
          username: user.username,
        };

        return comment;
      }),
    );

    const fileKeys = await Promise.all(
      task.files.map(async (fileId) => {
        const file = await this.fileModel.findById(fileId.toString());
        return { id: file._id, key: file.key, url: file.url } as IFile;
      }),
    );

    return {
      _id: task._id,
      title: task.title,
      description: task.description,
      author: { username: user.username },
      level: task.level,
      tags: task.tags,
      hint: task.hint,
      files: fileKeys,
      testcases: task.testcases,
      draft: task.draft,
      status: task.status,
      solution_code: task.solution_code,
      comments,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }

  async create(
    createTaskDto: CreateTaskDto,
    user: IUser,
  ): Promise<HttpExceptionOptions> {
    const task = await this.taskModel.findOne({ title: createTaskDto.title });

    if (task) {
      throw new HttpException('TASK_EXISTED', HttpStatus.BAD_REQUEST);
    }

    await this.taskModel.create({
      ...createTaskDto,
      author: user._id,
    });
    throw new HttpException('TASK_CREATED', HttpStatus.CREATED);
  }

  async getTasks(page = 1, limit = 25): Promise<ITaskResponseWithPagination> {
    const tasks = await this.taskModel
      .find()
      .select('-purchased_hint -passedBy')
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

  async getTaskById(id: string): Promise<ITaskResponse> {
    const task = await this.taskModel
      .findById(id)
      .select('-purchased_hint -passedBy');

    if (!task) {
      throw new HttpException('TASK_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    return this.formattedTaskData(task);
  }

  async getTestCasesByTaskId(id: string): Promise<ITestCase[]> {
    const task = await this.taskModel.findById(id);

    if (!task) {
      throw new HttpException('TASK_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    return task.testcases.map((testCase) => ({
      input: testCase.input,
      output: testCase.output,
    }));
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    user: IUser,
  ): Promise<HttpExceptionOptions> {
    const task = await this.taskModel.findById(id);

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
  ): Promise<HttpExceptionOptions> {
    const task = await this.taskModel.findById(id);

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

  async draftTask(
    id: string,
    updateDraftTaskDto: UpdateDraftTaskDto,
  ): Promise<HttpExceptionOptions> {
    const task = await this.taskModel.findById(id);

    if (!task) {
      throw new HttpException('TASK_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    if (task.status !== 'approved') {
      throw new HttpException('TASK_NOT_APPROVED', HttpStatus.BAD_REQUEST);
    }

    if (task.draft === updateDraftTaskDto.draft) {
      throw new HttpException('TASK_IS_DRAFT', HttpStatus.BAD_REQUEST);
    } else if (!task.draft === !updateDraftTaskDto.draft) {
      throw new HttpException('TASK_IS_PUBLISHED', HttpStatus.BAD_REQUEST);
    }

    const updatedTask = await this.taskModel.findByIdAndUpdate(
      id,
      updateDraftTaskDto,
      {
        new: true,
      },
    );

    if (!updatedTask.draft) {
      const embed = {
        title: `โจทย์ ${task.title} ถูกเพิ่มเข้าระบบแล้ว! 🎉`,
        description: `มีโจทย์ใหม่เข้ามาแล้วนะครับ [ไปเช็คกันเลย!](https://ceboostup.com/question/${task._id})`,
        color: 0x00ff00,
        author: {
          name: (await this.userModel.findById(task.author.toString()))
            .username,
          icon_url:
            'https://media.discordapp.net/attachments/1110818601868472421/1110942462001819678/IMG_5103.png?width=579&height=579',
        },
        fields: [
          {
            name: 'Description',
            value:
              task.description.length > 100
                ? `${task.description.substring(0, 100)}...`
                : task.description,
            inline: false,
          },
          {
            name: 'Level',
            value: task.level.toString(),
            inline: true,
          },
          {
            name: 'Tags',
            value: task.tags.join(', '),
            inline: true,
          },
          {
            name: 'Score',
            value: `${+task.level * 100}`,
            inline: true,
          },
        ],
        footer: {
          text: 'Made by Deviate Team x CE61-KMITL ❤️',
        },
      };
      this.discordService.sendEmbed(embed);
    } else {
      const embed = {
        title: `โจทย์ ${task.title} ถูกลบออกจากระบบแล้ว! 😢`,
        description: 'พี่ๆขอแก้ไขโจทย์ใหม่อีกทีนะครับ 🙏',
        color: 0xff0000,
        footer: {
          text: 'Made by Deviate Team x CE61-KMITL ❤️',
        },
      };
      this.discordService.sendEmbed(embed);
    }

    throw new HttpException('TASK_DRAFTED', HttpStatus.OK);
  }

  async deleteTask(id: string, user: IUser): Promise<HttpExceptionOptions> {
    const task = await this.taskModel.findById(id);

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
        const file = await this.fileModel.findById(fileId.toString());
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
  ): Promise<HttpExceptionOptions> {
    const task = await this.taskModel.findById(id);

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

  async deleteComment(
    id: string,
    user: IUser,
    commentId: string,
  ): Promise<HttpExceptionOptions> {
    const task = await this.taskModel.findById(id);

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
  ): Promise<HttpExceptionOptions> {
    const task = await this.taskModel.findById(id);

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
