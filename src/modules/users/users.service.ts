import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IUser } from '@/common/interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dtos/create-user.dto';
import { TasksService } from '../tasks/tasks.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<IUser>,
    private tasksService: TasksService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  async findById(id: string): Promise<IUser> {
    return this.userModel.findById(id);
  }

  async findOneByUsername(username: string): Promise<IUser> {
    return this.userModel.findOne({ username });
  }

  async findOneByEmail(email: string): Promise<IUser> {
    return this.userModel.findOne({ email });
  }

  async getProfile(user: IUser) {
    const tasks = await this.tasksService.findByAuthor(user._id);

    const formattedTasks = tasks.map((task) =>
      this.tasksService.formattedTaskData(task),
    );

    return {
      ...user.toJSON(),
      tasks: await Promise.all(formattedTasks),
    };
  }

  async update(
    id: string,
    user: IUser,
    updateUserDto: UpdateUserDto,
  ): Promise<IUser> {
    if (id !== user._id.toString()) {
      throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
    }

    const userExist = await this.findById(id);

    if (!userExist) {
      throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    if (updateUserDto.username && user.username !== updateUserDto.username) {
      const usernameExists = await this.findOneByUsername(
        updateUserDto.username,
      );

      if (usernameExists) {
        throw new HttpException('USERNAME_EXISTS', HttpStatus.BAD_REQUEST);
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await this.hashPassword(updateUserDto.password);
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { ...updateUserDto },
      {
        new: true,
        select: '-password',
      },
    );

    return updatedUser;
  }
}
