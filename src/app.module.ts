import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsuarioModule } from './usuario/usuario.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleModule } from './role/role.module';
import { AuthModule } from './auth/auth.module';
import { ProyectoModule } from './proyecto/proyecto.module';
import { FilesModule } from './files/files.module';
import { SeccionModule } from './seccion/seccion.module';
import { RevisionModule } from './revision/revision.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsuarioModule,
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('URI'),
      }),
    }),
    RoleModule,
    AuthModule,
    ProyectoModule,
    FilesModule,
    SeccionModule,
    RevisionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
