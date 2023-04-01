import {
  Body,
  Controller,
  Delete,
  ParseArrayPipe,
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
import { ApiTags, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { DeleteFilesDto } from './dto/delete-files.dto';

@ApiTags('Files')
@ApiBearerAuth()
@Controller('files')
@Roles(Role.AUDITOR, Role.STAFF)
@UseGuards(JwtGuard, RolesGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  @ApiConsumes('multipart/form-data')
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    return await this.filesService.uploadFiles(files);
  }

  @Delete()
  async deleteFiles(
    @Body(new ParseArrayPipe({ items: DeleteFilesDto }))
    deleteFilesDtos: DeleteFilesDto[],
  ) {
    return await this.filesService.deleteFiles(deleteFilesDtos);
  }
}
