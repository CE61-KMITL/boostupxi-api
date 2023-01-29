import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { IUser } from 'src/shared/interfaces/user.interface';
import { User } from 'src/modules/user/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import * as Bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<IUser>,
    private jwtService: JwtService,
  ) {}

  async generateToken(userId: string, role: string) {
    const payload = { sub: userId, role };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  async login(loginDto: LoginDto) {
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
    return this.generateToken(user._id, user.role);
  }
}
