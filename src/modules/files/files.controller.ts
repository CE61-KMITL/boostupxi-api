import {
  Body,
  Controller,
  Delete,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { JwtGuard } from 'src/shared/guards/jwt.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @Roles(Role.AUDITOR, Role.STAFF)
  @UseGuards(JwtGuard, RolesGuard)
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    return await this.filesService.uploadFiles(files);
  }

  @Delete()
  @Roles(Role.AUDITOR, Role.STAFF)
  @UseGuards(JwtGuard, RolesGuard)
  async deleteFiles(@Body() keys: { key: string }[]) {
    return await this.filesService.deleteFiles(keys);
  }
}
