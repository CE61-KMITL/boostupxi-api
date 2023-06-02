import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddSubmissionDto {
  @ApiProperty({
    example: '60b9b0b9e6b3f3b3e4f5e6d7',
    description: 'Id of the question',
  })
  @IsString()
  @IsNotEmpty()
  questionId: string;

  @ApiProperty({
    example: 'PPPPPP',
    description: 'Compilation result of the submission',
  })
  @IsString()
  @IsNotEmpty()
  compilationResult: string;

  @ApiProperty({
    example: 'console.log("Hello World")',
    description: 'Source code of the submission',
  })
  @IsString()
  @IsNotEmpty()
  source_code: string;
}
