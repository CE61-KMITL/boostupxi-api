import {
  Controller,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/shared/guards/jwt.guard';
import { UserI } from 'src/shared/interfaces/user.interface';
import { GetUser } from 'src/shared/decorators/get-user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/profile')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  getProfile(@GetUser() user: UserI) {
    return this.userService.getProfile(user);
  }
}
