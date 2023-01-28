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
import { UserI } from '../../shared/interfaces/user.interface';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { PoliciesGuard } from 'src/casl/guard/policies.guard';
import { CheckPolicies } from 'src/casl/decorator/check-policy.decorator';
import { CreateUserPolicyHandler } from 'src/common/policies/create.policy';
// import { Roles } from 'src/auth/decorators/role.decorator';
// import { Role } from 'src/shared/enums/role.enum';
// import { RolesGuard } from 'src/auth/guards/roles.guard';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Roles(Role.ADMIN)
  // @UseGuards(RolesGuard)
  // @CheckPolicies(new CreateUserPolicyHandler())
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserI> {
    return await this.userService.createUser(createUserDto);
  }

  // @Roles(Role.ADMIN)
  // @UseGuards(RolesGuard)
  @Get()
  async getUsers(): Promise<UserI[]> {
    return await this.userService.getUsers();
  }

  @Get(':id')
  async getUser(
    @Param('id') id: string,
    @GetUser() user: UserI,
  ): Promise<UserI> {
    if (user.id !== id) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    return await this.userService.getUser(id);
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() user: UserI,
  ) {
    if (user.id !== id) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    return await this.userService.updateUser(id, updateUserDto);
  }

  // @Roles(Role.ADMIN)
  // @UseGuards(RolesGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return await this.userService.deleteUser(id);
  }
}
