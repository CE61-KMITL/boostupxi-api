import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AddSubmissionDto } from './dtos/add-submission.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from '../tasks/schemas/task.schema';
import { Model } from 'mongoose';
import { ITask } from '@/common/interfaces/task.interface';
import { User } from '../users/schemas/user.schema';
import { IUser } from '@/common/interfaces/user.interface';
import { ISubmission } from '@/common/interfaces/submission.interface';

@Injectable()
export class SubmissionService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<ITask>,
    @InjectModel(User.name) private readonly userModel: Model<IUser>,
  ) {}

  private checkCompilationResultIsAllP(str: string): boolean {
    return [...str].every((char) => char === 'P');
  }

  async submit(
    addSubmissionDto: AddSubmissionDto,
    userId: string,
  ): Promise<ISubmission> {
    const question = await this.taskModel.findById(addSubmissionDto.questionId);
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

    if (!user) {
      throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    const status = this.checkCompilationResultIsAllP(
      addSubmissionDto.compilationResult,
    );

    const isSubmitted = question.passedBy.includes(user._id);

    if (status && !isSubmitted) {
      user.score += question.level * 100;
      question.passedBy.push(user._id);

      await Promise.all([user.save(), question.save()]);

      return {
        status,
        score: user.score,
        compilationResult: addSubmissionDto.compilationResult,
      };
    } else if (!status && isSubmitted) {
      user.score -= question.level * 100;
      question.passedBy = question.passedBy.filter(
        (userId) => userId.toString() !== user._id.toString(),
      );

      await Promise.all([user.save(), question.save()]);

      return {
        status,
        score: user.score,
        compilationResult: addSubmissionDto.compilationResult,
      };
    }

    return {
      status,
      score: user.score,
      compilationResult: addSubmissionDto.compilationResult,
    };
  }
}
