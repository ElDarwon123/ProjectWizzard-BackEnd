import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  constructor(@Inject() private readonly configService: ConfigService) {
    admin.apps.length ? admin.app : admin.initializeApp({
      credential: admin.credential.cert({
        projectId: configService.get<string>('FIREBASE_PROJECT_ID'),
        clientEmail: configService.get<string>('FIREBASE_CLIENT_EMAIL'),
        privateKey: configService
          .get<string>('FIREBASE_PRIVATE_KEY')
          .replace(/\\n/g, '\n'),
      }),
    });
  }

  async sendPushNotification(token: string, title: string, message: string) {
    const payload = {
      token,
      notification: {
        title,
        message,
      },
    };
    try {
      await admin.messaging().send(payload);
      console.log('notificacion sent');
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }
}
