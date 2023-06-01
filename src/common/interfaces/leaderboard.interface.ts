import { IUser } from './user.interface';

export interface IUserLeaderboardWithPagination {
  pages: number;
  data: IUser[];
  currentPage: number;
}

export interface IGroupLeaderboard {
  _id: string;
  score: number;
}
