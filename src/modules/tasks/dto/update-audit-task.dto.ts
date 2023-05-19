import { IsEnum, IsNotEmpty } from 'class-validator';
import { StatusType } from 'src/shared/interfaces/task.interface';
import { TaskStatus } from '../enum/task-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAuditTaskDto {
  @ApiProperty({
    example: 'approve',
    description: 'Status of the task',
  })
  @IsEnum(TaskStatus)
  @IsNotEmpty()
  status: StatusType;
}
