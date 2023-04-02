import {
  IsString,
  Min,
  Max,
  IsNumber,
  IsArray,
  IsNotEmpty,
} from 'class-validator';
import { IFile } from 'src/shared/interfaces/file.interface';
import { ITestCase } from 'src/shared/interfaces/testcase.interface';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Task 1',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Description',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  level: number;

  @ApiProperty({
    example: ['tag1', 'tag2'],
  })
  @IsArray()
  @IsNotEmpty()
  tags: string[];

  @ApiProperty({
    example: 'Hint',
  })
  @IsString()
  @IsNotEmpty()
  hint: string;

  @ApiProperty({
    example: [
      {
        input: 'input',
        output: 'output',
        published: true,
      },
    ],
  })
  @IsArray()
  @IsNotEmpty()
  testcases: ITestCase[];

  @ApiProperty({
    example: "console.log('Hello World!');",
  })
  @IsString()
  @IsNotEmpty()
  solution_code: string;

  @ApiProperty({
    example: [
      {
        key: 'key',
        url: 'url',
      },
    ],
  })
  @IsArray()
  @IsNotEmpty()
  files: IFile[];
}
