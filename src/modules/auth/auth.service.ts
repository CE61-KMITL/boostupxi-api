import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from '@/shared/interfaces/user.interface';
import { User } from '../user/schemas/user.schema';
import { LoginDto } from './dto/login.dto';
import * as Bcrypt from 'bcryptjs';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<IUser>,
    private jwtService: JwtService,
  ) {}

  generateToken({ userId, role }: { userId: string; role: string }): string {
    const payload = { sub: userId, role };
    return this.jwtService.sign(payload);
  }

  async login(loginDto: LoginDto, res: Response) {
    const user = await this.userModel.findOne({ email: loginDto.email });

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

    const token = this.generateToken({ userId: user._id, role: user.role });

    res.set('Authorization', token);
    throw new HttpException('LOGIN_SUCCESS', HttpStatus.OK);
  }
}
