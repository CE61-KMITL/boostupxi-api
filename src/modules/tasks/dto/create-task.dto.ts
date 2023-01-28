import {
  IsNotEmpty,
  IsString,
  Min,
  Max,
  IsNumber,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { Types } from 'mongoose';
import { TestCaseI } from 'src/shared/interfaces/testcase.interface';
import { StatusT } from 'src/shared/interfaces/task.interface';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  author: Types.ObjectId;

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
  testcases: TestCaseI[];

  @IsNotEmpty()
  @IsBoolean()
  draft: boolean;

  @IsNotEmpty()
  @IsBoolean()
  status: StatusT;
}
