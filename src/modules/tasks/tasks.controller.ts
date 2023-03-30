import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { JwtGuard } from 'src/shared/guards/jwt.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { TasksService } from '../tasks/tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UserI } from '../../shared/interfaces/user.interface';
import { TaskI } from 'src/shared/interfaces/task.interface';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
@Roles(Role.AUDITOR, Role.STAFF)
@UseGuards(JwtGuard, RolesGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: UserI,
  ): Promise<TaskI> {
    return await this.tasksService.createTask(createTaskDto, user);
  }

  @Get()
  async getTasks(): Promise<TaskI[]> {
    return await this.tasksService.getTasks();
  }

  @Get('/:id')
  async getTaskById(@Param('id') id: string): Promise<TaskI> {
    return await this.tasksService.getTaskById(id);
  }

  @Patch('/:id')
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return await this.tasksService.updateTask(id, updateTaskDto);
  }

  @Delete('/:id')
  async deleteTask(@Param('id') id: string, @GetUser() user: UserI) {
    return await this.tasksService.deleteTask(id, user);
  }
}
