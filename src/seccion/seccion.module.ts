import { Module } from '@nestjs/common';
import { SeccionService } from './seccion.service';
import { SeccionController } from './seccion.controller';
import { ProyectoModule } from 'src/proyecto/proyecto.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Seccion, seccionSchema } from './schema/seccion.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Seccion.name, schema: seccionSchema }]),
    ProyectoModule,
  ],
  controllers: [SeccionController],
  providers: [SeccionService],
  exports: [SeccionService],
})
export class SeccionModule {}
