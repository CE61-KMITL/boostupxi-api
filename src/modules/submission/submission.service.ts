import { Injectable } from '@nestjs/common';
import { AddSubmissionDto } from './dtos/add-submission.dto';

@Injectable()
export class SubmissionService {
  async submit(addSubmissionDto: AddSubmissionDto, userId: string) {
    return {
      message: 'Submission added successfully',
      data: {
        ...addSubmissionDto,
        userId,
      },
    };
  }
}
