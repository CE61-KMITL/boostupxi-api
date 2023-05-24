import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AwsService } from '../aws/aws.service';
import { DeleteFilesDto } from './dtos/delete-files.dto';

@Injectable()
export class FilesService {
  constructor(private awsService: AwsService) {}

  async uploadFiles(files: Express.Multer.File[]) {
    const regex = /^boostup_[a-zA-Z0-9_]+\.(png|jpeg|jpg|zip)$/;
    const invalidFiles = files.filter((file) => !regex.test(file.originalname));

    if (invalidFiles.length > 0) {
      throw new HttpException(
        `INVALID_FILE_NAME`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const uploadedFiles = await this.awsService.uploadFiles(files);
    return uploadedFiles;
  }

  async deleteFiles(deleteFilesDtos: DeleteFilesDto[]) {
    await this.awsService.deleteFiles(deleteFilesDtos);
    throw new HttpException('FILES_DELETED', HttpStatus.OK);
  }
}
