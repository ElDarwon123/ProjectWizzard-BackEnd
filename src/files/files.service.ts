import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { File, FileDocument } from './schemas/file.schema';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { MulterFilee } from './global';

@Injectable()
export class FilesService {
  constructor(@InjectModel(File.name) private fileModel: Model<FileDocument>) { }

  async create(file: MulterFilee): Promise<File> {
    const createdFile = new this.fileModel({
      filename: file.originalname,
      path: "http://localhost:4000/"+file.path,
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

  async delete(id: string): Promise<{ message: string }> {
    const file = await this.findOne(id);
    if (!file) {
      throw new NotFoundException('File not found');
    }

    await unlink(file.path); // Elimina el archivo del sistema de archivos
    await this.fileModel.findByIdAndDelete(id); // Elimina el documento de la base de datos

    return { message: 'File deleted successfully' };
  }
}
