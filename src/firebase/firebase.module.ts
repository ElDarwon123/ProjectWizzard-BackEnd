import { Module } from '@nestjs/common';
import { FirebaseController } from './firebase.controller';
import { FirebaseService } from './firebase.service';
import { SharedModule } from 'src/shared.module';
import { ConvocatoriaModule } from 'src/convocatoria/convocatoria.module';

@Module({
  imports: [SharedModule],
  controllers: [FirebaseController],
  providers: [FirebaseService]
})
export class FirebaseModule {}
