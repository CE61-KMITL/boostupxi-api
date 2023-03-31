import { IsBoolean, IsEnum, IsNotEmpty } from 'class-validator';
import { StatusT } from 'src/shared/interfaces/task.interface';
import { TaskStatus } from '../enum/task-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAuditTaskDto {
  @ApiProperty({
    example: 'reject',
  })
  @IsEnum(TaskStatus)
  @IsNotEmpty()
  status: StatusT;

  @ApiProperty({
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  draft: boolean;
}
