import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUser } from '../../shared/interfaces/user.interface';
import { GetUser } from '../../shared/decorators/get-user.decorator';
import { JwtGuard } from 'src/shared/guards/jwt.guard';
import { PoliciesGuard } from 'src/shared/guards/policies.guard';
import { CheckPolicies } from 'src/shared/decorators/check-policies.decorator';
import { CreateUserPolicyHandler, DeleteUserPolicyHandler } from '../authorization/policy-handler/user-policy.handler';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  @Post()
  @UseGuards(JwtGuard, PoliciesGuard)
  @CheckPolicies(new CreateUserPolicyHandler())
  async createUser(@Body() createUserDto: CreateUserDto): Promise<IUser> {
    return await this.userService.createUser(createUserDto);
  }

  @Get()
  async getUsers(): Promise<IUser[]> {
    return await this.userService.getUsers();
  }

  @Get(':id')
  async getUser(
    @Param('id') id: string,
    @GetUser() user: IUser,
  ): Promise<IUser> {
    if (user.id !== id) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    return await this.userService.getUser(id);
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() user: IUser,
  ) {
    if (user.id !== id) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    return await this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtGuard, PoliciesGuard)
  @CheckPolicies(new DeleteUserPolicyHandler())
  async deleteUser(@Param('id') id: string) {
    return await this.userService.deleteUser(id);
  }
}
