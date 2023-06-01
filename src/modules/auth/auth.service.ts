import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dtos/login.dto';
import * as Bcrypt from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/schemas/user.schema';
import { Model } from 'mongoose';
import { IUser } from '@/common/interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<IUser>,
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

    return this.generateToken({ userId: user._id, role: user.role });
  }
}
