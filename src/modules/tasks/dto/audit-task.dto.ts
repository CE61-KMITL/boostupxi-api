import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { TStatus } from 'src/shared/interfaces/task.interface';

export class AuditTaskDto {
  @IsNotEmpty()
  @IsString()
  status: TStatus;

  @IsNotEmpty()
  @IsBoolean()
  draft: boolean;
}
