import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@/common/guards/jwt.guard';
import { Role } from '@/common/enums/role.enum';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { GetUser } from '@/common/decorators/get-user.decorator';
import { IUser } from '@/common/interfaces/user.interface';

@ApiTags('Questions')
@Roles(Role.User, Role.Staff, Role.Auditor, Role.Staff, Role.Admin)
@UseGuards(JwtGuard, RolesGuard)
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
  async getQuestionById(
    @Param('id') id: string,
    @GetUser() user: IUser,) {
    return this.questionsService.getQuestionById(id, user);
  }

  @Get('/:id/hint')
  async getHintById(
    @Param('id') id: string,
    @GetUser() user: IUser,) {
    return this.questionsService.getHintById(id, user);
  }
}
