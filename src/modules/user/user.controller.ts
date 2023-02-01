import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/shared/guards/jwt.guard';
import { IUser } from 'src/shared/interfaces/user.interface';
import { GetUser } from 'src/shared/decorators/get-user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/profile')
  @UseGuards(JwtGuard)
  getProfile(@GetUser() user: IUser): IUser {
    return user;
  }
}
