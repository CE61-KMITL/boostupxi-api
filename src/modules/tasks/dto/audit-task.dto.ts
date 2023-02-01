import { IsBoolean, IsEnum } from 'class-validator';
import { TStatus } from 'src/shared/interfaces/task.interface';
import { TaskStatus } from '../enum/task-status.enum';


export class AuditTaskDto {
  @IsEnum(TaskStatus)
  status: TStatus;

  @IsBoolean()
  draft: boolean;
}
