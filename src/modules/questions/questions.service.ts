import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from '../tasks/schemas/task.schema';
import { Model } from 'mongoose';
import { ITask } from '@/common/interfaces/task.interface';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<ITask>,
  ) {}

  async getQuestions() {
    return [];
  }

  async getQuestionById(id: string) {
    return {};
  }
}
