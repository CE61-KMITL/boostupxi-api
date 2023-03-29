import { Controller } from '@nestjs/common';
import { TasksService } from '../tasks/tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}
}
