import { IsBoolean, IsEnum, IsNotEmpty } from 'class-validator';
import { StatusT } from 'src/shared/interfaces/task.interface';
import { TaskStatus } from '../enum/task-status.enum';

export class UpdateAuditTaskDto {
  @IsEnum(TaskStatus)
  @IsNotEmpty()
  status: StatusT;

  @IsBoolean()
  @IsNotEmpty()
  draft: boolean;
}
