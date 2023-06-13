import {
  Controller,
  Get,
  HttpStatus,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@/common/guards/jwt.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/common/enums/role.enum';
import { RolesGuard } from '@/common/guards/roles.guard';
import {
  IGroupLeaderboard,
  IUserLeaderboardWithPagination,
} from '@/common/interfaces/leaderboard.interface';

@ApiTags('Leaderboard')
@Roles(Role.User, Role.Staff, Role.Auditor, Role.Staff, Role.Admin)
@UseGuards(JwtGuard, RolesGuard)
@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get('/')
  async getLeaderboard(
    @Query(
      'page',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    page: number,
    @Query(
      'limit',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    limit: number,
  ): Promise<IUserLeaderboardWithPagination> {
    return await this.leaderboardService.getLeaderboard(page, limit);
  }

  @Get('/group')
  async getLeaderboardByGroup(): Promise<IGroupLeaderboard[]> {
    return await this.leaderboardService.getLeaderboardByGroup();
  }
}
