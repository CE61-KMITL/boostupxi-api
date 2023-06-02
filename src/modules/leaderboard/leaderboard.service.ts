import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/schemas/user.schema';
import { Model } from 'mongoose';
import { IUser } from '@/common/interfaces/user.interface';
import {
  IGroupLeaderboard,
  IUserLeaderboardWithPagination,
} from '@/common/interfaces/leaderboard.interface';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<IUser>,
  ) {}

  async getLeaderboard(
    page = 1,
    limit = 20,
  ): Promise<IUserLeaderboardWithPagination> {
    const count = await this.userModel.countDocuments({ role: 'user' });

    const leaderboardResult = await this.userModel
      .find({ role: 'user' })
      .select(
        '-password -_id -email -role -createdAt -updatedAt -__v -completedQuestions',
      )
      .sort({ score: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const pages = Math.ceil(count / limit);

    let rank = 1;
    const rankedResult = leaderboardResult.map((user, index) => {
      if (index > 0 && user.score !== leaderboardResult[index - 1].score) {
        rank = index + 1;
      }
      return { ...user.toObject(), rank };
    });

    return {
      currentPage: page,
      pages,
      data: rankedResult,
    };
  }

  async getLeaderboardByGroup(): Promise<IGroupLeaderboard[]> {
    const scoreByGroup = await this.userModel.aggregate([
      { $match: { role: 'user' } },
      { $group: { _id: '$group', score: { $sum: '$score' } } },
      { $sort: { score: -1 } },
    ]);

    let rank = 1;
    return scoreByGroup.map((group, index) => {
      if (index > 0 && group.score !== scoreByGroup[index - 1].score) {
        rank = index + 1;
      }
      return { ...group, rank };
    });
  }
}
