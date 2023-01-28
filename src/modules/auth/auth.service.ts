import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { UserI } from 'src/shared/interfaces/user.interface';
import { User } from 'src/modules/user/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import * as Bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserI>,
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

  async register(createUserDto: CreateUserDto) {
    try {
      const salt = Bcrypt.genSaltSync(10);
      const hashedPassword = Bcrypt.hashSync(createUserDto.password, salt);
      createUserDto.password = hashedPassword;
      const newUser = await this.userModel.create(createUserDto);
      return {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        score: newUser.score,
      } as UserI;
    } catch (error) {
      throw new HttpException('USER_ALREADY_EXISTS', HttpStatus.CONFLICT);
    }
  }
}
