import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dtos/login.dto';
import * as Bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dtos/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private generateToken({
    userId,
    role,
  }: {
    userId: string;
    role: string;
  }): string {
    const payload = { sub: userId, role };
    return this.jwtService.sign(payload);
  }

  async login(loginDto: LoginDto): Promise<string> {
    const user = await this.usersService.findOneByEmail(loginDto.email);

    if (!user) {
      throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    const isPasswordMatching = Bcrypt.compareSync(
      loginDto.password,
      user.password,
    );

    if (!isPasswordMatching) {
      throw new HttpException('INVALID_CREDENTIALS', HttpStatus.UNAUTHORIZED);
    }

    return this.generateToken({ userId: user._id, role: user.role });
  }

  async register(registerDto: RegisterDto): Promise<string> {
    const newUser = await this.usersService.create(registerDto);
    return this.generateToken({ userId: newUser._id, role: newUser.role });
  }
}
