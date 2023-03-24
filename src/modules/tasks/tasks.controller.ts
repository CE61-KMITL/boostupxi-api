import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { JwtGuard } from 'src/shared/guards/jwt.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { ITask } from 'src/shared/interfaces/task.interface';
import { UserI } from 'src/shared/interfaces/user.interface';
import { UpdateAuditTaskDto } from './dto/update-audit-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';
import { FilesInterceptor } from '@nestjs/platform-express';
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @Roles(Role.STAFF, Role.AUDITOR)
  @UseGuards(JwtGuard, RolesGuard)
  @UseInterceptors(FilesInterceptor('files'))
  async createTask(
    @Body('data') createTaskDto,
    @GetUser() user: UserI,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<ITask> {
    createTaskDto = JSON.parse(createTaskDto) as CreateTaskDto;
    return await this.tasksService.createTask(createTaskDto, user._id, files);
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

  @Patch(':id')
  @Roles(Role.STAFF, Role.AUDITOR)
  @UseGuards(JwtGuard, RolesGuard)
  @UseInterceptors(FilesInterceptor('files'))
  async updateTaskById(
    @Param('id') id: string,
    @GetUser() user: UserI,
    @Body('data') updateTaskDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<ITask> {
    updateTaskDto = JSON.parse(updateTaskDto) as UpdateTaskDto;
    return await this.tasksService.updateTaskById(
      id,
      user,
      updateTaskDto,
      files,
    );
  }

  @Patch('audit/:id')
  @Roles(Role.AUDITOR)
  @UseGuards(JwtGuard, RolesGuard)
  async updateAuditTaskById(
    @Param('id') id: string,
    @Body() auditTaskDto: UpdateAuditTaskDto,
  ): Promise<ITask> {
    return await this.tasksService.updateAuditTaskById(id, auditTaskDto);
  }

  @Delete(':id')
  @Roles(Role.STAFF, Role.AUDITOR)
  @UseGuards(JwtGuard, RolesGuard)
  async deleteTaskById(@Param('id') id: string, @GetUser() user: UserI) {
    return await this.tasksService.deleteTaskById(id, user);
  }
}
