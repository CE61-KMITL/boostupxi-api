import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsService {
  constructor(private configService: ConfigService) {}
  private s3 = new AWS.S3({
    accessKeyId: this.configService.get<string>('aws.accessKeyId'),
    secretAccessKey: this.configService.get<string>('aws.secretAccessKey'),
  });

  newFileName(originalname: string): string {
    const originalFileName = originalname.split('.')[0];
    const extension = originalname.split('.').pop();
    return `${originalFileName}~${Date.now()}.${extension}`;
  }

  async uploadFiles(files: Array<Express.Multer.File>) {
    try {
      const promises = files.map(async (file) => {
        const params = {
          Bucket: this.configService.get<string>('aws.bucket'),
          Key: this.newFileName(file.originalname),
          Body: file.buffer,
          ACL: 'public-read',
        };
        const uploadedFile = await this.s3.upload(params).promise();
        return uploadedFile;
      });
      return Promise.all(promises);
    } catch (err) {
      throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
    }
  }

  async deleteFiles(files: Array<{ key: string }>) {
    try {
      const promises = files.map((file) => {
        const params = {
          Bucket: this.configService.get<string>('aws.bucket'),
          Key: file.key,
        };
        return this.s3.deleteObject(params).promise();
      });
      return Promise.all(promises);
    } catch (err) {
      throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
    }
  }
}
