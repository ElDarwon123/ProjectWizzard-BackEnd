import { Bucket } from '@google-cloud/storage';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { getApps, initializeApp } from 'firebase-admin/app';
import { Readable } from 'stream';

@Injectable()
export class FirebaseService {
  private bucket: Bucket;

  constructor(private readonly configService: ConfigService) {
    const firebaseConfig = {
      apiKey: configService.get<string>('FIREBASE_API_KEY'),
      authDomain: configService.get<string>('FIREBASE_AUTH_DOMAIN'),
      projectId: configService.get<string>('FIREBASE_PROJECT_ID'),
      storageBucket: configService.get<string>('FIREBASE_STORAGE_BUCKET'),
      messagingSenderId: configService.get<string>('FIREBASE_MESSAGING_SENDER'),
      appId: configService.get<string>('FIREBASE_APP_ID'),
    };
    if (!getApps().length) {
      initializeApp(firebaseConfig);
    }

    // Configura el bucket de Firebase Storage
    this.bucket = admin.storage().bucket();

  }
  
  async sendPushNotification(token: string, title: string, body: string, ): Promise<void> {
    try {
      const message = {
        notification: {
          title,
          body,
        },
        token
      }
      const response = await admin.messaging().send(message);
      console.log('noti enviada '+ response);
      
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }


  async uploadFile(
    buffer: Buffer,
    destination: string,
    mimetype: string,
  ): Promise<void> {
    try {
      const stream = Readable.from(buffer);
      await this.bucket.file(destination).save(stream, {
        contentType: mimetype,
      });
      console.log('file uploaded');
    } catch (error) {
      throw new BadRequestException('Error uploading file:' + error);
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
