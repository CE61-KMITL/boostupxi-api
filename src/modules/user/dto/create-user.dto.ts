import {
  IsEmail,
  IsString,
  IsAlphanumeric,
  MinLength,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsAlphanumeric()
  @MinLength(4)
  readonly username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  readonly password: string;

  @IsNotEmpty()
  @IsNumber()
  readonly score: number;

  @IsNotEmpty()
  @IsString()
  readonly role: string;
}
