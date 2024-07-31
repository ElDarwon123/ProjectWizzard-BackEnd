import { Module } from '@nestjs/common';
import { ConvocatoriaService } from './convocatoria.service';
import { ConvocatoriaController } from './convocatoria.controller';
import { SharedModule } from 'src/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [ConvocatoriaController],
  providers: [ConvocatoriaService],
})
export class ConvocatoriaModule {}
