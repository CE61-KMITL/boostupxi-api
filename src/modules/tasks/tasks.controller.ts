import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { JwtGuard } from 'src/shared/guards/jwt.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { ITask } from 'src/shared/interfaces/task.interface';
import { IUser } from 'src/shared/interfaces/user.interface';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @Roles(Role.STAFF, Role.AUDITOR)
  @UseGuards(JwtGuard, RolesGuard)
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: IUser,
  ): Promise<ITask> {
    return await this.tasksService.createTask(createTaskDto, user._id);
  }

  @Get()
  @Roles(Role.STAFF, Role.AUDITOR)
  @UseGuards(JwtGuard, RolesGuard)
  async getTasks(): Promise<ITask[]> {
    return await this.tasksService.getTasks();
  }

  @Get(':id')
  @Roles(Role.STAFF, Role.AUDITOR)
  @UseGuards(JwtGuard, RolesGuard)
  async getTaskById(@Param('id') id: string): Promise<ITask> {
    return await this.tasksService.getTaskById(id);
  }

  @Delete(':id')
  @Roles(Role.STAFF, Role.AUDITOR)
  @UseGuards(JwtGuard, RolesGuard)
  async deleteTaskById(@Param('id') id: string, @GetUser() user: IUser) {
    return await this.tasksService.deleteTaskById(id, user.role, user._id);
  }
}
