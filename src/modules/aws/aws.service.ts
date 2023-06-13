import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectCommandOutput,
} from '@aws-sdk/client-s3';
import { IFile } from '@/common/interfaces/file.interface';

@Injectable()
export class AwsService {
  constructor(private configService: ConfigService) {}
  private s3 = new S3Client({
    region: this.configService.get<string>('aws.region'),
    credentials: {
      accessKeyId: this.configService.get<string>('aws.accessKeyId'),
      secretAccessKey: this.configService.get<string>('aws.secretAccessKey'),
    },
  });

  newFileName(originalname: string): string {
    const originalFileName = originalname.split('.')[0];
    const extension = originalname.split('.').pop();

    const newDate = new Date();
    newDate.setHours(newDate.getHours() + 7);

    return `${originalFileName}~${newDate.toISOString()}.${extension}`;
  }

  async uploadFiles(
    files: Array<Express.Multer.File>,
  ): Promise<{ key: string; url: string }[]> {
    try {
      const promises = files.map(async (file) => {
        const params = {
          Bucket: this.configService.get<string>('aws.bucket'),
          Key: this.newFileName(file.originalname),
          Body: file.buffer,
          ACL: 'public-read',
        };
        const command = new PutObjectCommand(params);
        await this.s3.send(command);
        const key = params.Key;
        const url = `https://${params.Bucket}.s3.amazonaws.com/${key}`;
        return { key, url };
      });
      return Promise.all(promises);
    } catch (err) {
      throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
    }
  }

  async deleteFiles(
    files: Array<{ key: string }>,
  ): Promise<DeleteObjectCommandOutput[]> {
    try {
      const promises = files.map((file) => {
        const params = {
          Bucket: this.configService.get<string>('aws.bucket'),
          Key: file.key,
        };
        const command = new DeleteObjectCommand(params);
        return this.s3.send(command);
      });
      return Promise.all(promises);
    } catch (err) {
      throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
    }
  }
}
