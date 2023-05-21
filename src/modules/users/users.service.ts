import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IUser } from '@/common/interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from '../tasks/schemas/task.schema';
import { ITask } from '@/common/interfaces/task.interface';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<ITask>,
    @InjectModel(User.name) private readonly userModel: Model<IUser>,
  ) {}

  async getProfile(user: IUser) {
    const tasks = await this.taskModel.find({ 'author.id': user._id });

    return {
      _id: user._id,
      email: user.email,
      username: user.username,
      score: user.score,
      role: user.role,
      tasks,
    };
  }

  async update(id: string, user: IUser, updateUserDto: UpdateUserDto) {
    if (id !== user._id.toString()) {
      throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
    }

    const userExist = await this.userModel.findById(id);

    if (!userExist) {
      throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    if (updateUserDto.username) {
      const usernameExists = await this.userModel.findOne({
        username: updateUserDto.username,
      });

      if (usernameExists) {
        throw new HttpException('USERNAME_EXISTS', HttpStatus.BAD_REQUEST);
      }
    }

    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(updateUserDto.password, salt);
      updateUserDto.password = hashedPassword;
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        id,
        { ...updateUserDto },
        {
          new: true,
        },
      )
      .select('-password');

    return updatedUser;
  }
}
