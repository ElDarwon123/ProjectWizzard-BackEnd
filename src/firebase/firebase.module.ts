import { Module } from '@nestjs/common';
import { FirebaseController } from './firebase.controller';
import { FirebaseService } from './firebase.service';
import { SharedModule } from 'src/shared.module';
import { ConvocatoriaModule } from 'src/convocatoria/convocatoria.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [SharedModule, ConfigModule],
  controllers: [FirebaseController],
  providers: [FirebaseService],
  exports: [FirebaseService, FirebaseModule]
})
export class FirebaseModule {}
