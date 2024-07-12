import { Module } from '@nestjs/common';
import { SeccionService } from './seccion.service';
import { SeccionController } from './seccion.controller';
import { SharedModule } from 'src/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [SeccionController],
  providers: [SeccionService],
  exports: [SeccionService],
})
export class SeccionModule {}
