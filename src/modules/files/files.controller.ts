import { GetUser } from '@/common/decorators/get-user.decorator';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/common/enums/role.enum';
import { JwtGuard } from '@/common/guards/jwt.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { IUser } from '@/common/interfaces/user.interface';
import {
  Body,
  Controller,
  Delete,
  HttpExceptionOptions,
  HttpStatus,
  ParseArrayPipe,
  ParseFilePipeBuilder,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { DeleteFilesDto } from './dtos/delete-files.dto';
import { FilesService } from './files.service';

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
    @GetUser() user: IUser,
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
  ): Promise<
    HttpExceptionOptions | { id: string; url: string; key: string }[]
  > {
    return await this.filesService.uploadFiles(user, files);
  }

  @Delete()
  async deleteFiles(
    @GetUser() user: IUser,
    @Body(new ParseArrayPipe({ items: DeleteFilesDto }))
    deleteFilesDtos: DeleteFilesDto[],
  ): Promise<HttpExceptionOptions> {
    return await this.filesService.deleteFiles(user, deleteFilesDtos);
  }
}
