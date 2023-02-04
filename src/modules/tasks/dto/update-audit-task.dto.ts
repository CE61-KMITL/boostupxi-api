import { IsBoolean, IsEnum, IsNotEmpty } from 'class-validator';
import { TStatus } from 'src/shared/interfaces/task.interface';
import { TaskStatus } from '../enum/task-status.enum';

export class UpdateAuditTaskDto {
  @IsEnum(TaskStatus)
  @IsNotEmpty()
  status: TStatus;

  @IsBoolean()
  @IsNotEmpty()
  draft: boolean;
}
