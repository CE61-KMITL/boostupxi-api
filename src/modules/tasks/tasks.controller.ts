import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { JwtGuard } from 'src/shared/guards/jwt.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { TasksService } from '../tasks/tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { IUser } from '../../shared/interfaces/user.interface';
import { TaskI } from 'src/shared/interfaces/task.interface';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateAuditTaskDto } from './dto/update-audit-task.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.Auditor, Role.Staff)
  @UseGuards(JwtGuard, RolesGuard)
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: IUser,
  ) {
    return await this.tasksService.createTask(createTaskDto, user);
  }

  @Get()
  @Roles(Role.Auditor, Role.Staff, Role.User)
  @UseGuards(JwtGuard, RolesGuard)
  async getTasks(
    @Query(
      'page',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    page: number,
    @Query(
      'limit',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    limit: number,
  ) {
    return await this.tasksService.getTasks(page, limit);
  }

  @Get('/:id')
  @Roles(Role.Auditor, Role.Staff, Role.User)
  @UseGuards(JwtGuard, RolesGuard)
  async getTaskById(@Param('id') id: string): Promise<TaskI> {
    return await this.tasksService.getTaskById(id);
  }

  @Get('/user/:id')
  @Roles(Role.Auditor, Role.Staff, Role.User)
  @UseGuards(JwtGuard, RolesGuard)
  async getTasksByUser(@Param('id') id: string): Promise<TaskI[]> {
    return await this.tasksService.getTasksByUser(id);
  }

  @Patch('/:id')
  @Roles(Role.Auditor, Role.Staff)
  @UseGuards(JwtGuard, RolesGuard)
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return await this.tasksService.updateTask(id, updateTaskDto);
  }

  @Patch('/audit/:id')
  @Roles(Role.Auditor)
  @UseGuards(JwtGuard, RolesGuard)
  async auditTask(
    @Param('id') id: string,
    @Body() updateAuditTaskDto: UpdateAuditTaskDto,
  ) {
    return await this.tasksService.auditTask(id, updateAuditTaskDto);
  }

  @Delete('/:id')
  @Roles(Role.Auditor, Role.Staff)
  @UseGuards(JwtGuard, RolesGuard)
  async deleteTask(@Param('id') id: string, @GetUser() user: IUser) {
    return await this.tasksService.deleteTask(id, user);
  }

  @Post('/:id/comment')
  @Roles(Role.Auditor, Role.Staff)
  @UseGuards(JwtGuard, RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  async addComment(
    @Param('id') id: string,
    @GetUser() user: IUser,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    console.log(createCommentDto);
    return await this.tasksService.createComment(id, user, createCommentDto);
  }

  @Delete('/:id/comment/:commentId')
  @Roles(Role.Auditor, Role.Staff)
  @UseGuards(JwtGuard, RolesGuard)
  async deleteComment(
    @Param('id') id: string,
    @GetUser() user: IUser,
    @Param('commentId') commentId: string,
  ) {
    return await this.tasksService.deleteComment(id, user, commentId);
  }

  @Patch('/:id/comment/:commentId')
  @Roles(Role.Auditor, Role.Staff)
  @UseGuards(JwtGuard, RolesGuard)
  async updateComment(
    @Param('id') id: string,
    @GetUser() user: IUser,
    @Body() updateCommentDto: UpdateCommentDto,
    @Param('commentId') commentId: string,
  ) {
    return await this.tasksService.updateComment(
      id,
      user,
      updateCommentDto,
      commentId,
    );
  }
}
