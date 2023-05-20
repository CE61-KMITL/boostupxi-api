import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from '@/common/guards/jwt.guard';
import { IUser } from '@/common/interfaces/user.interface';
import { GetUser } from '@/common/decorators/get-user.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/profile')
  getProfile(@GetUser() user: IUser) {
    return this.usersService.getProfile(user);
  }
}
