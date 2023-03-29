import {
  Body,
  Controller,
  Delete,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { JwtGuard } from 'src/shared/guards/jwt.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @Roles(Role.AUDITOR, Role.STAFF)
  @UseGuards(JwtGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return await this.fileService.uploadFile(file);
  }

  @Delete()
  @Roles(Role.AUDITOR, Role.STAFF)
  @UseGuards(JwtGuard, RolesGuard)
  async deleteFile(@Body() { key }: { key: string }) {
    return await this.fileService.deleteFile(key);
  }
}
