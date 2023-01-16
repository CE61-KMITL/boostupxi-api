import { Injectable, HttpException } from '@nestjs/common';
import { UserI } from './interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserI>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserI> {
    try {
      const newUser = await this.userModel.create(createUserDto);
      return newUser;
    } catch (error) {
      throw new HttpException('Error creating user', 500);
    }
  }
}
