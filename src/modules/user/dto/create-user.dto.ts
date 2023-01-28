import {
  IsEmail,
  IsString,
  IsAlphanumeric,
  MinLength,
  IsNotEmpty,
  IsNumber,
  Min
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
  password: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  readonly score: number;

  @IsNotEmpty()
  @IsString()
  readonly role: string;
}
