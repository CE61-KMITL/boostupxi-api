import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskI } from 'src/shared/interfaces/task.interface';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDto) : Promise<TaskI> {
    return await this.tasksService.createTask(createTaskDto);
  }

  @Get()
  async getTasks(): Promise<TaskI[]> {
    return await this.tasksService.getTasks();
  }

  @Get(':id')
  async getTask(@Param('id') id: string): Promise<TaskI> {
    return await this.tasksService.getTask(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return await this.tasksService.updateTask(+id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.deleteTask(+id);
  }
}
