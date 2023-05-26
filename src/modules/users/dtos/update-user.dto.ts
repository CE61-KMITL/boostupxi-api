import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'John',
    description: "User's username.",
  })
  @IsString()
  @IsOptional()
  @Matches(/^[a-zA-Z0-9_]+$/, { message: 'Username must be alphanumeric.' })
  @MinLength(3, { message: 'Username must be at least 3 characters long.' })
  @MaxLength(20, { message: 'Username must be at most 20 characters long.' })
  readonly username: string;

  @ApiProperty({
    example: 'examplepassword',
    description: "User's password.",
  })
  @IsString()
  @IsOptional()
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  password: string;
}
