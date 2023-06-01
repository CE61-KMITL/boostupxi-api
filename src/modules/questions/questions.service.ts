import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from '../tasks/schemas/task.schema';
import { Model, Types } from 'mongoose';
import { ITask } from '@/common/interfaces/task.interface';
import { IFile } from '@/common/interfaces/file.interface';
import { IUser } from '@/common/interfaces/user.interface';
import { User } from '../users/schemas/user.schema';
import { File } from '../files/schemas/file.schema';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<ITask>,
    @InjectModel(User.name) private readonly userModel: Model<IUser>,
    @InjectModel(File.name) private readonly fileModel: Model<IFile>,
  ) {}

  private async formattedQuestionData(question: ITask, userId: string) {
    const user = await this.userModel.findById(question.author.toString());

    const fileKeys = await Promise.all(
      question.files.map(async (fileId) => {
        const file = await this.fileModel.findById(fileId.toString());
        return { id: file._id, key: file.key, url: file.url } as IFile;
      }),
    );

    const hintPurchased = question.purchased_hint.includes(
      new Types.ObjectId(userId),
    );

    let hint: string | undefined;
    if (hintPurchased) {
      hint = question.hint;
    }

    return {
      _id: question._id,
      title: question.title,
      description: question.description,
      author: { username: user.username },
      level: question.level,
      tags: question.tags,
      files: fileKeys,
      testcases: question.testcases.filter((testcase) => testcase.published),
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
      passedByUser: question.passedBy.includes(new Types.ObjectId(userId)),
      userPassCount: question.passedBy.length,
      score: question.level * 100,
      hintCost: question.level ? question.level * 40 : 0,
      ...(hint && { hint }),
    };
  }

  async getQuestions(page = 1, limit = 10, userId: string) {
    const questions = await this.taskModel
      .find({ status: 'approved', draft: false })
      .skip(limit * (page - 1))
      .limit(limit);

    const count = await this.taskModel
      .find({ status: 'approved', draft: false })
      .countDocuments();

    const pages = Math.ceil(count / limit);

    const formattedQuestion = questions.map((question) =>
      this.formattedQuestionData(question, userId),
    );

    return {
      currentPage: page,
      pages,
      data: await Promise.all(formattedQuestion),
    };
  }

  async getQuestionById(id: string, userId: string) {
    const question = await this.taskModel.findById(id);

    if (!question) {
      throw new HttpException('QUESTION_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    if (question.status !== 'approved' || question.draft) {
      throw new HttpException(
        "YOU_CAN'T_GET_THIS_QUESTION",
        HttpStatus.FORBIDDEN,
      );
    }
    return this.formattedQuestionData(question, userId);
  }

  async buyHint(id: string, userId: string) {
    const question = await this.taskModel.findById(id);
    const user = await this.userModel.findById(userId);

    if (!question) {
      throw new HttpException('QUESTION_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    if (question.status !== 'approved' || question.draft) {
      throw new HttpException(
        "YOU_CAN'T_GET_THIS_QUESTION",
        HttpStatus.FORBIDDEN,
      );
    }

    if (question.purchased_hint.includes(user._id)) {
      throw new HttpException(
        'YOU_HAVE_BOUGHT_THIS_HINT',
        HttpStatus.FORBIDDEN,
      );
    }

    const hintCost = question.level * 40;

    if (user.score < hintCost) {
      throw new HttpException('NOT_ENOUGH_SCORE', HttpStatus.FORBIDDEN);
    }

    user.score -= hintCost;

    question.purchased_hint.push(user._id);

    await Promise.all([question.save(), user.save()]);

    throw new HttpException('BUY_HINT_SUCCESS', HttpStatus.OK);
  }
}
