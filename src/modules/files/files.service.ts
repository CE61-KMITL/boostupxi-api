import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AwsService } from '../aws/aws.service';

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

  async deleteFiles(keys: { key: string }[]) {
    await this.awsService.deleteFiles(keys);
    throw new HttpException('FILES_DELETED', HttpStatus.OK);
  }
}
