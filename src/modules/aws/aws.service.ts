import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsService {
  constructor(private configService: ConfigService) {}
  private s3 = new AWS.S3({
    accessKeyId: this.configService.get<string>('aws.accessKeyId'),
    secretAccessKey: this.configService.get<string>('aws.secretAccessKey'),
  });

  async uploadFiles(files: Array<Express.Multer.File>) {
    const promises = files.map((file) => {
      const params = {
        Bucket: this.configService.get<string>('aws.bucket'),
        Key: file.originalname,
        Body: file.buffer,
        ACL: 'public-read',
      };
      return this.s3.upload(params).promise();
    });
    return Promise.all(promises);
  }

  async deleteFiles(files: Array<{ key: string }>) {
    const promises = files.map((file) => {
      const params = {
        Bucket: this.configService.get<string>('aws.bucket'),
        Key: file.key,
      };
      return this.s3.deleteObject(params).promise();
    });
    return Promise.all(promises);
  }
}
