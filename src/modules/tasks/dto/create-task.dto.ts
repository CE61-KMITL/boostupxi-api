import {
  IsString,
  Min,
  Max,
  IsNumber,
  IsArray,
  IsNotEmpty,
} from 'class-validator';
import { FileI } from 'src/shared/interfaces/file.interface';
import { TestCaseI } from 'src/shared/interfaces/testcase.interface';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  level: number;

  @IsArray()
  @IsNotEmpty()
  tags: string[];

  @IsString()
  @IsNotEmpty()
  hint: string;

  @IsArray()
  @IsNotEmpty()
  testcases: TestCaseI[];

  @IsString()
  @IsNotEmpty()
  solution_code: string;

  @IsArray()
  @IsNotEmpty()
  files: FileI[];
}
