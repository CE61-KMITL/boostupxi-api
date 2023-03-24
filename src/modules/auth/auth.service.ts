import { Injectable } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserI } from 'src/shared/interfaces/user.interface';
import { User } from '../user/schemas/user.schema';
import { LoginDto } from './dto/login.dto';
import * as Bcrypt from 'bcryptjs';
import { TokenI } from './interfaces/jwt.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserI>,
    private jwtService: JwtService,
  ) {}

  generateToken({ userId, role }: { userId: string; role: string }): TokenI {
    const payload = { sub: userId, role };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  async login(loginDto: LoginDto): Promise<TokenI> {
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
