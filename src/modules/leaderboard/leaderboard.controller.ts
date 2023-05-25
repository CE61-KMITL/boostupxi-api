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

@ApiTags('Leaderboard')
@UseGuards(JwtGuard)
@Roles(Role.User, Role.Staff, Role.Auditor, Role.Staff)
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
  ) {
    return await this.leaderboardService.getLeaderboard(page, limit);
  }

  @Get('/group')
  async getLeaderboardByGroup() {
    return await this.leaderboardService.getLeaderboardByGroup();
  }
}
