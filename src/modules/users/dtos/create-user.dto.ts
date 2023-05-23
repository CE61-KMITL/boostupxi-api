import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'username',
    description: "User's username.",
  })
  @IsString()
  @IsNotEmpty({ message: 'Username is required.' })
  readonly username: string;

  @ApiProperty({
    example: 'example@example.com',
    description: "User's email.",
  })
  @IsString()
  @IsNotEmpty({ message: 'Email is required.' })
  readonly email: string;

  @ApiProperty({
    example: 'password',
    description: "User's password.",
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is required.' })
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  password: string;
}
