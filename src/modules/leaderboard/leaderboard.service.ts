import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../user/schemas/user.schema';
import { Model } from 'mongoose';
import { IUser } from 'src/shared/interfaces/user.interface';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<IUser>,
  ) {}
  getLeaderboard() {
    return 'This action returns all leaderboard';
  }

  getLeaderboardByGroup() {
    return 'This action returns leaderboard by group';
  }
}
