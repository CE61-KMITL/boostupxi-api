import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto';
import { UserI } from './interfaces/user.interface';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserI> {
    return await this.userService.createUser(createUserDto);
  }
}
