import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from '../tasks/schemas/task.schema';
import { Model } from 'mongoose';
import { ITask } from '@/common/interfaces/task.interface';
import { UsersService } from '../users/users.service';
import { FilesService } from '../files/files.service';
import { IFile } from '@/common/interfaces/file.interface';
import { TasksService } from '../tasks/tasks.service';
import { IUser } from '@/common/interfaces/user.interface';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<ITask>,
    private usersService: UsersService,
    private filesService: FilesService,
    private taskService: TasksService
  ) {}

  private async formattedQuestionData(question: ITask) {
    const user = await this.usersService.findById(question.author.toString());

    question.author = {
      username: user.username,
    };

    const fileKeys = await Promise.all(
      question.files.map(async (fileId) => {
        const file = await this.filesService.findById(fileId.toString());
        return { id: file._id, key: file.key, url: file.url } as IFile;
      }),
    );

    question.files = fileKeys;

    question.testcases = question.testcases.filter(
      (testcase) => testcase.published,
    );

    return question;
  }

  async getQuestions(page = 1, limit = 10) {
    const questions = await this.taskModel
      .find({ status: 'approved', draft: false })
      .select('-status -draft -solution_code -comments -hint -hint_user')
      .skip(limit * (page - 1))
      .limit(limit);

    const count = await this.taskModel
      .find({ status: 'approved', draft: false })
      .countDocuments();

    const pages = Math.ceil(count / limit);

    const formattedQuestion = questions.map((question) =>
      this.formattedQuestionData(question),
    );

    return {
      currentPage: page,
      pages,
      data: await Promise.all(formattedQuestion),
    };
  }

  async getQuestionById(id: string, user: IUser) {
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
    if(question.hint_user.includes(user._id)){
      const selectQuestion = await this.taskModel
      .findById(id)
      .select('-status -draft -solution_code -comments -hint_user');
      return this.formattedQuestionData(selectQuestion);
    }
    else{
      const selectQuestion = await this.taskModel
      .findById(id)
      .select('-status -draft -solution_code -comments -hint -hint_user');
      return this.formattedQuestionData(selectQuestion);
    }
  }

  async getHintById(id: string, user: IUser) {
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
    
    this.taskService.getHint(id, user)

    const hint = await this.taskModel
      .findById(id)
      .select('hint');

    return hint;
  }
}
