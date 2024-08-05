import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello!, we are ProjectWizzard, go to /api for look our routes!';
  }
}
