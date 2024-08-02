import { Bucket } from '@google-cloud/storage';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { Readable } from 'stream';

@Injectable()
export class FirebaseService {
  private bucket: Bucket;

  constructor(
    private readonly configService: ConfigService,
  ) {
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

  // async sendPushNotification(title: string, body: string, link: string) {
    
  //   const tokens = await this.usuarioService.getAllTokenFCM();

  //   const message = tokens.map(token => ({
  //     tokens,
  //     notification: {
  //       title,
  //       body,
  //     },
  //     webpush: {
  //       notification: {
  //         title,
  //         body,
  //         link
  //       }
  //     }
  //   }));
  //   try {
  //     const response = await admin.messaging().sendEachForMulticast({
  //       tokens,
  //       notification: {
  //         title,
  //         body,
  //       },
  //       webpush: {
  //         notification: {
  //           title,
  //           body,
  //           link,
  //         }
  //       },
  //     });
  //     console.log('notificacion sent', response);
  //   } catch (error) {
  //     console.error('Error sending notification:', error);
  //   }
  // }

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
