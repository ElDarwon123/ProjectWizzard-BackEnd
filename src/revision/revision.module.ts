import { Module } from '@nestjs/common';
import { RevisionService } from './revision.service';
import { RevisionController } from './revision.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Revision, revisionSchema } from './schema/revision.schema';
import { SeccionModule } from 'src/seccion/seccion.module';
import { UsuarioModule } from 'src/usuario/usuario.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Revision.name, schema: revisionSchema },
    ]),
    SeccionModule,
    UsuarioModule,
  ],
  controllers: [RevisionController],
  providers: [RevisionService],
})
export class RevisionModule {}
