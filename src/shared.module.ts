import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Proyecto, ProyectoSchema } from './proyecto/schema/proyecto.shema';
import { Usuario, usuarioSchema } from './usuario/schema/usuario.schema';
import { Seccion, seccionSchema } from './seccion/schema/seccion.schema';
import { ProyectoService } from './proyecto/proyecto.service';
import { UsuarioService } from './usuario/usuario.service';
import { SeccionService } from './seccion/seccion.service';
import { Revision, revisionSchema } from './revision/schema/revision.schema';
import { File, FileSchema } from './files/schemas/file.schema';
import { RevisionService } from './revision/revision.service';
import { FilesService } from './files/files.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Proyecto.name, schema: ProyectoSchema },
      { name: Usuario.name, schema: usuarioSchema },
      { name: Seccion.name, schema: seccionSchema },
      { name: Revision.name, schema: revisionSchema },
      { name: File.name, schema: FileSchema },
    ]),
  ],
  providers: [
    ProyectoService,
    UsuarioService,
    SeccionService,
    RevisionService,
    FilesService,
  ],
  exports: [
    ProyectoService,
    UsuarioService,
    SeccionService,
    RevisionService,
    FilesService,
    MongooseModule,
  ],
})
export class SharedModule {}
