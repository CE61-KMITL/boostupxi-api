import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';

@Controller('questions')
export class QuestionsController {
  constructor(private questionsService: QuestionsService) {}

  @Get()
  async getQuestions(
    @Query(
      'page',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    page: number,
    @Query(
      'limit',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    limit: number,
  ) {
    return this.questionsService.getQuestions(page, limit);
  }

  @Get('/:id')
  async getQuestionById(@Param('id') id: string) {
    return this.questionsService.getQuestionById(id);
  }
}
