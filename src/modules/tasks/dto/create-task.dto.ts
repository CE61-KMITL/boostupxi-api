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
import { ApiProperty, ApiTags } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    example: 'คิดเลขนะ',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'use all you have',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 3,
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  level: number;

  @ApiProperty({
    example: ['ctf', 'reverse engineer'],
  })
  @IsArray()
  @IsNotEmpty()
  tags: string[];

  @ApiProperty({
    example: 'google',
  })
  @IsString()
  @IsNotEmpty()
  hint: string;

  @ApiProperty({
    example: [
      {
        input: '1',
        output: 'a',
        published: true,
      },
      {
        input: '2',
        output: 'aa',
        published: true,
      },
      {
        input: '3',
        output: 'aaa',
        published: false,
      },
    ],
  })
  @IsArray()
  @IsNotEmpty()
  testcases: TestCaseI[];

  @ApiProperty({
    example:
      '#include <stdio.h> int main() { printf("Hello, World!");return 0; }',
  })
  @IsString()
  @IsNotEmpty()
  solution_code: string;

  @ApiProperty({
    example: [
      {
        key: '43229f6f-51ca-4c0b-b3ee-836b2f602adf.png',
        url: 'https://ce-boostup-xi.s3.amazonaws.com/43229f6f-51ca-4c0b-b3ee-836b2f602adf.png',
        originalName: '01_20230223_กิตติพศ หลำบางช้าง.png',
      },
    ],
  })
  @IsArray()
  @IsNotEmpty()
  files: FileI[];
}
