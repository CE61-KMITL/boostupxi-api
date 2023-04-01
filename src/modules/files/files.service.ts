import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AwsService } from '../aws/aws.service';
import { DeleteFilesDto } from './dto/delete-files.dto';

@Injectable()
export class FilesService {
  constructor(private awsService: AwsService) {}

  async uploadFiles(files: Express.Multer.File[]) {
    const uploadedFiles = await this.awsService.uploadFiles(files);
    return uploadedFiles.map((file) => {
      return {
        key: file.Key,
        url: file.Location,
      };
    });
  }

  async deleteFiles(deleteFilesDtos: DeleteFilesDto[]) {
    await this.awsService.deleteFiles(deleteFilesDtos);
    throw new HttpException('FILES_DELETED', HttpStatus.OK);
  }
}
