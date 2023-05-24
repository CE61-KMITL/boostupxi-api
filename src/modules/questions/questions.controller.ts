import { Controller, Get, Param } from '@nestjs/common';
import { QuestionsService } from './questions.service';

@Controller('questions')
export class QuestionsController {
  constructor(private questionsService: QuestionsService) {}

  @Get()
  async getQuestions() {
    return this.questionsService.getQuestions();
  }

  @Get('/:id')
  async getQuestionById(@Param('id') id: string) {
    return this.questionsService.getQuestionById(id);
  }
}
