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
import { UpdateAuditTaskDto } from './dto/update-audit-task.dto';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

@Controller('tasks')
@ApiTags('Tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiSecurity('JWT-auth')
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.AUDITOR, Role.STAFF)
  @UseGuards(JwtGuard, RolesGuard)
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: UserI,
  ) {
    return await this.tasksService.createTask(createTaskDto, user);
  }

  @Get()
  @ApiSecurity('JWT-auth')
  @Roles(Role.AUDITOR, Role.STAFF, Role.USER)
  @UseGuards(JwtGuard, RolesGuard)
  async getTasks(): Promise<TaskI[]> {
    return await this.tasksService.getTasks();
  }

  @Get('/:id')
  @ApiSecurity('JWT-auth')
  @Roles(Role.AUDITOR, Role.STAFF, Role.USER)
  @UseGuards(JwtGuard, RolesGuard)
  async getTaskById(@Param('id') id: string): Promise<TaskI> {
    return await this.tasksService.getTaskById(id);
  }

  @Patch('/:id')
  @ApiSecurity('JWT-auth')
  @Roles(Role.AUDITOR, Role.STAFF)
  @UseGuards(JwtGuard, RolesGuard)
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return await this.tasksService.updateTask(id, updateTaskDto);
  }

  @Patch('/audit/:id')
  @ApiSecurity('JWT-auth')
  @Roles(Role.AUDITOR)
  @UseGuards(JwtGuard, RolesGuard)
  async auditTask(
    @Param('id') id: string,
    @Body() updateAuditTaskDto: UpdateAuditTaskDto,
  ) {
    return await this.tasksService.auditTask(id, updateAuditTaskDto);
  }

  @Delete('/:id')
  @ApiSecurity('JWT-auth')
  @Roles(Role.AUDITOR, Role.STAFF)
  @UseGuards(JwtGuard, RolesGuard)
  async deleteTask(@Param('id') id: string, @GetUser() user: UserI) {
    return await this.tasksService.deleteTask(id, user);
  }
}
