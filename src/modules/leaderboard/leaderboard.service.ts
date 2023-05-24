import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/schemas/user.schema';
import { Model } from 'mongoose';
import { IUser } from '@/common/interfaces/user.interface';
import { UsersService } from '../users/users.service';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<IUser>,
  ) {}

  async getLeaderboard(page = 1, limit = 20) {
    const users = await this.userModel.aggregate([
      {
        $match: { role: 'user' },
      },
      {
        $sort: { score: -1 },
      },
      {
        $project: {
          password: 0,
          role: 0,
        },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: limit,
      },
    ]);

    const count = await this.userModel.find({ role: 'user' }).countDocuments();
    const pages = Math.ceil(count / limit);

    return {
      currentPage: page,
      pages,
      data: await Promise.all(users),
    };
  }

  async getLeaderboardByGroup() {
    const userGroups = await this.userModel.aggregate([
      {
        $match: { role: 'user' },
      },
      {
        $group: {
          _id: '$group',
          score: { $sum: '$score' },
        },
      },
      {
        $sort: { score: -1 },
      },
    ]);

    return userGroups;
  }
}
