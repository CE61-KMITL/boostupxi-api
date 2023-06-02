import {
  HttpException,
  HttpExceptionOptions,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AddSubmissionDto } from './dtos/add-submission.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from '../tasks/schemas/task.schema';
import { Model, Types } from 'mongoose';
import { ITask } from '@/common/interfaces/task.interface';
import { User } from '../users/schemas/user.schema';
import { IUser } from '@/common/interfaces/user.interface';
import { ISubmission } from '@/common/interfaces/submission.interface';
import { Submission } from './schemas/submission.schema';

@Injectable()
export class SubmissionService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<ITask>,
    @InjectModel(User.name) private readonly userModel: Model<IUser>,
    @InjectModel(Submission.name)
    private readonly submissionModel: Model<ISubmission>,
  ) {}

  private checkCompilationResultIsAllP(str: string): boolean {
    return [...str].every((char) => char === 'P');
  }

  async getSubmissionByQuestionIdandUserId(
    questionId: string,
    userId: string,
  ): Promise<ISubmission> {
    const submission = await this.submissionModel.findOne({
      user: userId,
      question: new Types.ObjectId(questionId),
    });

    if (!submission) {
      throw new HttpException('SUBMISSION_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    return submission;
  }

  async submit(
    addSubmissionDto: AddSubmissionDto,
    userId: string,
  ): Promise<HttpExceptionOptions> {
    const question = await this.taskModel.findById(addSubmissionDto.questionId);
    const user = await this.userModel.findById(userId);

    if (!question)
      throw new HttpException('QUESTION_NOT_FOUND', HttpStatus.NOT_FOUND);
    if (question.status !== 'approved' || question.draft)
      throw new HttpException(
        "YOU_CAN'T_GET_THIS_QUESTION",
        HttpStatus.FORBIDDEN,
      );
    if (!user) throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);

    const status = this.checkCompilationResultIsAllP(
      addSubmissionDto.compilationResult,
    );
    const isSubmitted = question.passedBy.includes(user._id);

    const submissionData = {
      question: question._id,
      user: user._id,
      status,
      source_code: addSubmissionDto.source_code,
      result: addSubmissionDto.compilationResult,
    };

    if (isSubmitted && !status) {
      user.score -= question.level * 100;
      question.passedBy = question.passedBy.filter(
        (id) => id.toString() !== user._id.toString(),
      );
      user.completedQuestions = user.completedQuestions.filter(
        (id) => id.toString() !== question._id.toString(),
      );
    } else if (!isSubmitted && status) {
      user.score += question.level * 100;
      question.passedBy.push(user._id);
      user.completedQuestions.push(question._id);
    }

    await Promise.all([user.save(), question.save()]);

    const submission = await this.submissionModel.findOneAndUpdate(
      { question: question._id, user: user._id },
      submissionData,
      { new: true, upsert: true },
    );

    if (!submission)
      throw new HttpException('SUBMIT_FAILED', HttpStatus.BAD_REQUEST);

    throw new HttpException('SUBMIT_SUCCESS', HttpStatus.OK);
  }
}
