import { Role } from '@/common/enums/role.enum';
import { JwtGuard } from '@/common/guards/jwt.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import {
  Body,
  Controller,
  Get,
  HttpExceptionOptions,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '@/common/decorators/roles.decorator';
import { ApiTags } from '@nestjs/swagger';
import { SubmissionService } from './submission.service';
import { AddSubmissionDto } from './dtos/add-submission.dto';
import { GetUser } from '@/common/decorators/get-user.decorator';
import { IUser } from '@/common/interfaces/user.interface';
import { ISubmission } from '@/common/interfaces/submission.interface';

@ApiTags('Submission')
@Controller('/submission')
@Roles(Role.User)
@UseGuards(JwtGuard, RolesGuard)
export class SubmissionController {
  constructor(private submissionService: SubmissionService) {}

  @Post('/')
  async submit(
    @Body() addSubmissionDto: AddSubmissionDto,
    @GetUser() user: IUser,
  ): Promise<HttpExceptionOptions> {
    return await this.submissionService.submit(addSubmissionDto, user._id);
  }

  @Get('/:questionId')
  async getSubmissionByQuestionIdandUserId(
    @Param('questionId') questionId: string,
    @GetUser() user: IUser,
  ): Promise<ISubmission> {
    return await this.submissionService.getSubmissionByQuestionIdandUserId(
      questionId,
      user._id,
    );
  }
}
