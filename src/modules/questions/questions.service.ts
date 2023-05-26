import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from '../tasks/schemas/task.schema';
import { Model } from 'mongoose';
import { ITask } from '@/common/interfaces/task.interface';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<ITask>,
  ) {}

  async getQuestions(page = 1, limit = 9) {
    const tasks = await this.taskModel.aggregate([
      {
        $match: { status: 'approved' },
      },
      {
        $sort: { level: 1 },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: limit,
      },
      {
        $project: {
          title: 1,
          author: 1,
          level: 1,
          tags: 1,
        },
      },
    ]);

    const count = await this.taskModel
      .find({ status: 'approved' })
      .countDocuments();
    const pages = Math.ceil(count / limit);

    return {
      currentPage: page,
      pages,
      data: await Promise.all(tasks),
    };
  }

  async getQuestionById(id: string) {
    const check_task_status = await this.taskModel.findById(id);

    if (check_task_status.status != 'approved') {
      throw new HttpException('TASK_NOT_APPROVED', HttpStatus.FORBIDDEN);
    }

    const task = await this.taskModel.findOne({ _id: id }).select({
      testcases: {
        $filter: {
          input: '$testcases',
          as: 'testcase',
          cond: { $eq: ['$$testcase.published', true] },
        },
      },
      title: 1,
      description: 1,
      author: 1,
      level: 1,
      tags: 1,
      hint: 1,
      files: 1,
      comments: 1,
    });

    return task;
  }
}
