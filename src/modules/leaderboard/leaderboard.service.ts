import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/schemas/user.schema';
import { Model } from 'mongoose';
import { IUser } from '@/common/interfaces/user.interface';
import {
  IGroupLeaderboard,
  IUserLeaderboard,
  IUserLeaderboardWithPagination,
} from '@/common/interfaces/leaderboard.interface';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<IUser>,
  ) {}

  private calculateRank<T>(data: T[], scoreProperty: keyof T): T[] {
    let rank = 1;
    return data.map((item, index) => {
      if (index > 0 && item[scoreProperty] !== data[index - 1][scoreProperty]) {
        rank = index + 1;
      }
      return { ...item, rank };
    });
  }

  async getLeaderboard(
    page = 1,
    limit = 20,
  ): Promise<IUserLeaderboardWithPagination> {
    const count = await this.userModel.countDocuments({ role: 'user' });

    const leaderboardResult = await this.userModel.aggregate([
      { $match: { role: 'user' } },
      { $sort: { score: -1 } },
      { $project: { _id: 0, username: 1, group: 1, score: 1 } },
    ]);

    const pages = Math.ceil(count / limit);

    const startIndex = (page - 1) * limit;

    return {
      currentPage: page,
      pages,
      data: this.calculateRank<IUserLeaderboard>(
        leaderboardResult,
        'score',
      ).slice(startIndex, startIndex + limit),
    };
  }

  async getLeaderboardByGroup(): Promise<IGroupLeaderboard[]> {
    const scoreByGroup = await this.userModel.aggregate([
      { $match: { role: 'user' } },
      { $group: { _id: '$group', score: { $sum: '$score' } } },
      { $sort: { score: -1 } },
    ]);

    return this.calculateRank<IGroupLeaderboard>(scoreByGroup, 'score');
  }
}
