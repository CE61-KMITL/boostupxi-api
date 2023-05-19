import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { IUser } from '@/shared/interfaces/user.interface';
import { GetUser } from '@/shared/decorators/get-user.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('User')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/profile')
  getProfile(@GetUser() user: IUser) {
    return this.userService.getProfile(user);
  }
}
