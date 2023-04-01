import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteFilesDto {
  @ApiProperty({
    example: 'key1',
  })
  @IsString()
  @IsNotEmpty()
  key: string;
}
