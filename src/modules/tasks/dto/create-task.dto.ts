import {
  IsNotEmpty,
  IsString,
  Min,
  Max,
  IsNumber,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { ITestCase } from 'src/shared/interfaces/testcase.interface';
import { TStatus } from 'src/shared/interfaces/task.interface';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  level: number;

  @IsNotEmpty()
  @IsArray()
  tags: string[];

  @IsNotEmpty()
  @IsString()
  hint: string;

  @IsNotEmpty()
  @IsArray()
  files: string[];

  @IsNotEmpty()
  @IsArray()
  testcases: ITestCase[];

  @IsNotEmpty()
  @IsBoolean()
  draft: boolean;

  @IsNotEmpty()
  @IsString()
  status: TStatus;
}
