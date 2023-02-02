import {
  IsString,
  Min,
  Max,
  IsNumber,
  IsArray,
  IsNotEmpty,
} from 'class-validator';
import { ITestCase } from 'src/shared/interfaces/testcase.interface';

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
  files: string[];

  @IsArray()
  @IsNotEmpty()
  testcases: ITestCase[];
}
