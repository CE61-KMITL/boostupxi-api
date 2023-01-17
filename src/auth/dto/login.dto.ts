import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  readonly password: string;
}
