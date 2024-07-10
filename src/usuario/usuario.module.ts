import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { usuarioSchema } from './schema/usuario.schema';
import { RoleModule } from 'src/role/role.module';
import { SeccionModule } from 'src/seccion/seccion.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Usuario', schema: usuarioSchema }]),
    RoleModule,
    SeccionModule,
  ],
  controllers: [UsuarioController],
  providers: [UsuarioService],
  exports: [UsuarioService],
})
export class UsuarioModule {}
