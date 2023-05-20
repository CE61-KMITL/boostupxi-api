import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  ParseArrayPipe,
  ParseFilePipeBuilder,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/common/enums/role.enum';
import { JwtGuard } from '@/common/guards/jwt.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { FilesService } from './files.service';
import { ApiTags, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { DeleteFilesDto } from './dtos/delete-files.dto';

@ApiTags('Files')
@ApiBearerAuth()
@Controller('files')
@Roles(Role.Auditor, Role.Staff, Role.Admin)
@UseGuards(JwtGuard, RolesGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  @ApiConsumes('multipart/form-data')
  async uploadFiles(
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|zip)/,
        })
        .addMaxSizeValidator({
          maxSize: 1024 * 1024 * 5,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    files: Express.Multer.File[],
  ) {
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
