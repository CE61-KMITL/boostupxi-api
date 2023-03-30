import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AwsService } from '../aws/aws.service';

@Injectable()
export class FileService {
  constructor(private awsService: AwsService) {}

  async uploadFile(file: Express.Multer.File) {
    try {
      const uploadedFile = await this.awsService.uploadFile(file);
      return {
        key: uploadedFile.Key,
        url: uploadedFile.Location,
        originalName: uploadedFile.originalname,
      };
    } catch (err) {
      throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
    }
  }

  async deleteFile(key: string) {
    try {
      await this.awsService.deleteFile(key);
      throw new HttpException('FILE_DELETED', HttpStatus.OK);
    } catch (err) {
      throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
    }
  }
}
