import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'John',
    description: "User's username.",
  })
  @IsString()
  @IsOptional()
  @Matches(/^[a-zA-Z0-9_]+$/, { message: 'Username must be alphanumeric.' })
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
