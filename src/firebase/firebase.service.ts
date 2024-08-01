import { Bucket } from '@google-cloud/storage';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { Express } from 'express';
import { MulterField } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { Readable } from 'stream';

@Injectable()
export class FirebaseService {
  private bucket: Bucket;

  constructor(@Inject() private readonly configService: ConfigService) {
    admin.apps.length
      ? admin.app
      : admin.initializeApp({
          credential: admin.credential.cert({
            projectId: configService.get<string>('FIREBASE_PROJECT_ID'),
            clientEmail: configService.get<string>('FIREBASE_CLIENT_EMAIL'),
            privateKey: configService
              .get<string>('FIREBASE_PRIVATE_KEY')
              .replace(/\\n/g, '\n'),
          }),
          storageBucket: configService.get<string>('FIREBASE_STORAGE_BUCKET'),
        });
    this.bucket = admin.storage().bucket();
  }

  async sendPushNotification(token: string, title: string, body: string) {
    const payload = {
      token,
      notification: {
        title,
        body,
      },
    };
    try {
      await admin.messaging().send(payload);
      console.log('notificacion sent');
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  async uploadFile(buffer: Buffer, destination: string, mimetype: string): Promise<void> {

    try {
      const stream = Readable.from(buffer);
      await this.bucket.file(destination).save(stream, {
        contentType: mimetype
      });
      console.log('file uploaded');
      
    } catch (error) {

      throw new BadRequestException('Error uploading file:'+ error);
    }
  }

  async downloadFile(filepath: string): Promise<Buffer> {
    try {
      const file = this.bucket.file(filepath);
      const [fileBuffer] = await file.download();
      console.log('file downloaded successfully');
      return fileBuffer;
    } catch (error) {
      throw new NotFoundException('Download file error:', error);
    }
  }
  // acabar delete files e intregarlo con los proyectos
  async deleteFile(destination: string): Promise<void> {
    try {
      await this.bucket.file(destination).delete();
    } catch (error) {
      throw new NotFoundException('Delete file error:', error);
    }
  }
}
