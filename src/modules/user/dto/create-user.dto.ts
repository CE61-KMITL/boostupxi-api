import {
  IsNotEmpty,
  IsEmail,
  IsString,
  IsAlphanumeric,
  MinLength,
  MaxLength,
  IsNumber,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsAlphanumeric()
  @MinLength(4)
  @MaxLength(20)
  readonly username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  readonly password: string;

  @IsNotEmpty()
  @IsNumber()
  readonly score: number;

  @IsNotEmpty()
  @IsString()
  readonly role: string;

  @IsNotEmpty()
  @IsNumber()
  readonly finished: number;
}
