import { IsString, Min, Max, IsNumber, IsArray } from 'class-validator';
import { ITestCase } from 'src/shared/interfaces/testcase.interface';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  level: number;

  @IsArray()
  tags: string[];

  @IsString()
  hint: string;

  @IsArray()
  files: string[];

  @IsArray()
  testcases: ITestCase[];
}
