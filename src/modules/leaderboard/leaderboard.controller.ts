import { Controller, Get, UseGuards } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@/common/guards/jwt.guard';

@ApiTags('Leaderboard')
@UseGuards(JwtGuard)
@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get('/')
  async getLeaderboard() {
    return await this.leaderboardService.getLeaderboard();
  }

  @Get('/group')
  async getLeaderboardByGroup() {
    return await this.leaderboardService.getLeaderboardByGroup();
  }
}
