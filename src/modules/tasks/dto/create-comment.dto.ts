import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    example: 'Comment',
    description: 'Message of the comment',
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}
