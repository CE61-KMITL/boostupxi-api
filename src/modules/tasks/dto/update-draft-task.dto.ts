import { IsNotEmpty, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDraftTaskDto {
  @ApiProperty({
    example: 'true',
    description: 'Draft status of the task',
  })
  @IsBoolean()
  @IsNotEmpty()
  draft: boolean;
}
