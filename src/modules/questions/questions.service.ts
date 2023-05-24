import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from '../tasks/schemas/task.schema';
import { Model, Types } from 'mongoose';
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
    const task = await this.taskModel.aggregate([
      {
        $match: { _id: new Types.ObjectId(id), status: 'approved' },
      },
      {
        $sort: { level: 1 },
      },
      {
        $addFields: {
          testcases: {
            $filter: {
              input: '$testcases',
              as: 'testcase',
              cond: { $eq: ['$$testcase.published', true] },
            },
          },
        },
      },
      {
        $project: {
          draft: 0,
          status: 0,
          solution_code: 0,
        },
      },
    ]);

    return task[0];
  }
}
