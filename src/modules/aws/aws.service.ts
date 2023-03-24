import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class AwsService {
  constructor(private configService: ConfigService) {}
  private s3 = new AWS.S3({
    accessKeyId: this.configService.get<string>('aws.accessKeyId'),
    secretAccessKey: this.configService.get<string>('aws.secretAccessKey'),
    endpoint: this.configService.get<string>('aws.endpoint'),
    sslEnabled: false,
    s3ForcePathStyle: true,
  });

  newFileName(originalname: string): string {
    const extension = originalname.split('.').pop();
    return `${uuidV4()}.${extension}`;
  }

  async uploadFiles(files: Array<Express.Multer.File>) {
    const promises = files.map((file) => {
      const params = {
        Bucket: this.configService.get<string>('aws.bucket'),
        Key: this.newFileName(file.originalname),
        Body: file.buffer,
        ACL: 'public-read',
      };
      return this.s3.upload(params).promise();
    });
    return Promise.all(promises);
  }

  async updateFiles(
    oldFiles: Array<{ key: string }>,
    newFiles: Array<Express.Multer.File>,
  ) {
    const promises = newFiles.map((file) => {
      const params = {
        Bucket: this.configService.get<string>('aws.bucket'),
        Key: this.newFileName(file.originalname),
        Body: file.buffer,
        ACL: 'public-read',
      };
      return this.s3.upload(params).promise();
    });
    await this.deleteFiles(oldFiles);
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
