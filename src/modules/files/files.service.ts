import { IFile } from '@/common/interfaces/file.interface';
import { IUser } from '@/common/interfaces/user.interface';
import {
  HttpException,
  HttpExceptionOptions,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AwsService } from '../aws/aws.service';
import { DeleteFilesDto } from './dtos/delete-files.dto';
import { File } from './schemas/file.schema';

@Injectable()
export class FilesService {
  constructor(
    @InjectModel(File.name) private readonly fileModel: Model<IFile>,
    private awsService: AwsService,
  ) {}

  async uploadFiles(
    user: IUser,
    files: Express.Multer.File[],
  ): Promise<
    HttpExceptionOptions | { id: string; url: string; key: string }[]
  > {
    const regex = /^boostup_[a-zA-Z0-9_]+\.(png|jpeg|jpg|zip)$/;
    const invalidFiles = files.filter((file) => !regex.test(file.originalname));

    if (invalidFiles.length > 0) {
      throw new HttpException(
        `INVALID_FILE_NAME`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const uploadedFiles = await this.awsService.uploadFiles(files);
    if (uploadedFiles && uploadedFiles.length > 0) {
      const fileDocuments = uploadedFiles.map((file) => ({
        ...file,
        owner: user._id,
      }));

      const insertedFiles = await this.fileModel.insertMany(fileDocuments);

      return insertedFiles.map((file) => ({
        id: file._id,
        url: file.url,
        key: file.key,
      }));
    }

    throw new HttpException(`FILE_UPLOAD_FAILED`, HttpStatus.BAD_REQUEST);
  }

  async deleteFiles(
    user: IUser,
    deleteFilesDtos: DeleteFilesDto[],
  ): Promise<HttpExceptionOptions> {
    const fileKeys = deleteFilesDtos.map((file) => file.key);

    const files = await this.fileModel.find({
      owner: user._id,
      key: { $in: fileKeys },
    });

    const isOwner = files.every(
      (file) => file.owner.toString() === user._id.toString(),
    );

    if (
      (files.length !== deleteFilesDtos.length || !isOwner) &&
      user.role !== 'admin'
    ) {
      throw new HttpException(
        'USER_DOES_NOT_HAVE_PERMISSION',
        HttpStatus.FORBIDDEN,
      );
    }

    let deleteFilesQuery;

    if (user.role === 'admin') {
      deleteFilesQuery = {
        key: { $in: fileKeys },
      };
    } else {
      deleteFilesQuery = {
        owner: user._id,
        key: { $in: fileKeys },
      };
    }

    const deletePromises = [
      this.fileModel.deleteMany(deleteFilesQuery),
      this.awsService.deleteFiles(deleteFilesDtos),
    ];

    await Promise.all(deletePromises);

    throw new HttpException('FILES_DELETED', HttpStatus.OK);
  }
}
