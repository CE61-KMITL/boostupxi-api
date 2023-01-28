import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserI } from '../../shared/interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';
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
      return {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        score: newUser.score,
      } as UserI;
    } catch (error) {
      throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
    }
  }

  async getUsers(): Promise<UserI[]> {
    const users = await this.userModel
      .find()
      .select('-password -__v')
      .exec();
    return users;
  }

  async getUser(id: string): Promise<UserI> {
    const user = await this.userModel
      .findById(id)
      .select('-password -__v')
      .exec();
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UserI> {
    try {
      const user = await this.userModel
        .findByIdAndUpdate(id, updateUserDto, {
          new: true,
        })
        .select('-password -__v')
        .exec();
      return user;
    } catch (error) {
      throw new HttpException(
        'INTERNAL_SERVER_ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteUser(id: string) {
    const user = await this.userModel.findByIdAndDelete(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    throw new HttpException('User deleted', HttpStatus.OK);
  }
}
