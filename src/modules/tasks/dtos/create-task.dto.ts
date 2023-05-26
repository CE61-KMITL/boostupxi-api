import {
  IsString,
  Min,
  Max,
  IsNumber,
  IsArray,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { ITestCase } from '@/common/interfaces/testcase.interface';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Task 1',
    description: 'Title of the task',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Description',
    description: 'Description of the task',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 1,
    description: 'Level of the task',
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  level: number;

  @ApiProperty({
    example: ['tag1', 'tag2'],
    description: 'Tags of the task',
  })
  @IsArray()
  @IsNotEmpty()
  tags: string[];

  @ApiProperty({
    example: 'Hint',
    description: 'Hint of the task',
  })
  @IsString()
  @IsOptional()
  hint: string;

  @ApiProperty({
    example: [
      {
        input: 'input',
        output: 'output',
        published: true,
      },
    ],
    description: 'Testcases of the task',
  })
  @IsArray()
  @IsNotEmpty()
  testcases: ITestCase[];

  @ApiProperty({
    example: "console.log('Hello World!');",
    description: 'Solution code of the task',
  })
  @IsString()
  @IsNotEmpty()
  solution_code: string;

  @ApiProperty({
    example: ['id1', 'id2'],
    description: 'Files of the task',
  })
  @IsArray()
  @IsOptional()
  files: Types.ObjectId[];
}
