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
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/shared/interfaces/role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserI> {
    return await this.userService.create(createUserDto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Get()
  async findAll(): Promise<UserI[]> {
    return await this.userService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @GetUser() user: UserI,
  ): Promise<UserI> {
    if (user.id !== id) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    return await this.userService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() user: UserI,
  ) {
    if (user.id !== id) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    return await this.userService.update(id, updateUserDto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.userService.remove(id);
  }
}
