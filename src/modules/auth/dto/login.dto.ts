import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'example@example.com',
    description: "User's email.",
  })
  @IsEmail({}, { message: 'Email is not valid.' })
  @IsNotEmpty({ message: 'Email is required.' })
  readonly email: string;

  @ApiProperty({
    example: 'password',
    description: "User's password.",
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is required.' })
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  readonly password: string;
}
