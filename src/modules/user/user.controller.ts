import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/shared/guards/jwt.guard';
import { UserI } from 'src/shared/interfaces/user.interface';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/profile')
  @UseGuards(JwtGuard)
  getProfile(@GetUser() user: UserI) {
    return this.userService.getProfile(user);
  }
}
