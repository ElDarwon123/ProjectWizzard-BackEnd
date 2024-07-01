import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { File, FileDocument } from './schemas/file.schema';

@Injectable()
export class FilesService {
  constructor(@InjectModel(File.name) private fileModel: Model<FileDocument>) {}

  async create(file: Express.MulterFile): Promise<File> {
    const createdFile = new this.fileModel({
      filename: file.originalname,
      path: file.path,
      mimetype: file.mimetype,
      size: file.size,
    });
    return createdFile.save();
  }

  async findAll(): Promise<File[]> {
    return this.fileModel.find().exec();
  }

  async findOne(id: string): Promise<File> {
    return this.fileModel.findById(id).exec();
  }
}
