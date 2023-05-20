import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteFilesDto {
  @ApiProperty({
    example: 'key1',
    description: 'File key',
  })
  @IsString()
  @IsNotEmpty()
  key: string;
}
