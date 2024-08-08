import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello!, we are ProjectWizzard, go to /api if you wanna look our swagger!';
  }
}
