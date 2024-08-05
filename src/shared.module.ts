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
import { BlackList, BlackListSchema } from './auth/schema/auth.entity';
import { AuthService } from './auth/auth.service';
import {
  Convocatoria,
  convocatoriaSchema,
} from './convocatoria/schemas/convocatoria.entity';
import { ConvocatoriaService } from './convocatoria/convocatoria.service';
import { FirebaseService } from './firebase/firebase.service';
import { ConfigService } from '@nestjs/config';
import {
  NotificacionProyecto,
  notiProjectSchema,
} from './notificaciones/schemas/notificacion-proyecto.schema';
import {
  notiConvocatoriaSchema,
  NotificacionConvocatoria,
} from './notificaciones/schemas/notificacion-convocatoria.schema';
import { NotificacionesService } from './notificaciones/notificaciones.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Proyecto.name, schema: ProyectoSchema },
      { name: Usuario.name, schema: usuarioSchema },
      { name: Seccion.name, schema: seccionSchema },
      { name: Revision.name, schema: revisionSchema },
      { name: File.name, schema: FileSchema },
      { name: BlackList.name, schema: BlackListSchema },
      { name: Convocatoria.name, schema: convocatoriaSchema },
      { name: NotificacionProyecto.name, schema: notiProjectSchema },
      { name: NotificacionConvocatoria.name, schema: notiConvocatoriaSchema },
    ]),
  ],
  providers: [
    ProyectoService,
    UsuarioService,
    SeccionService,
    RevisionService,
    FilesService,
    AuthService,
    ConvocatoriaService,
    FirebaseService,
    ConfigService,
    NotificacionesService,
    JwtService,
  ],
  exports: [
    ProyectoService,
    UsuarioService,
    SeccionService,
    RevisionService,
    FilesService,
    MongooseModule,
    AuthService,
    ConvocatoriaService,
    FirebaseService,
    ConfigService,
    NotificacionesService,
    JwtService,
  ],
})
export class SharedModule {}
