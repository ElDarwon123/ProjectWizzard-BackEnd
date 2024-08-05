import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsuarioModule } from './usuario/usuario.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ProyectoModule } from './proyecto/proyecto.module';
import { FilesModule } from './files/files.module';
import { SeccionModule } from './seccion/seccion.module';
import { RevisionModule } from './revision/revision.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { strict } from 'assert';
import { join } from 'path';
import { ConvocatoriaModule } from './convocatoria/convocatoria.module';
import { FirebaseModule } from './firebase/firebase.module';
import { MulterModule } from '@nestjs/platform-express';
import { NotificacionesModule } from './notificaciones/notificaciones.module';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads'
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('URI'),
      }),
    }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST'),
          port: 587, // El puerto estándar para SMTP de Gmail
          secure: false, // Usar TLS
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: configService.get<string>('MAIL_FROM'),
        },
        template: {
          dir: join(__dirname,'../templates/email' ),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    UsuarioModule,
    AuthModule,
    ProyectoModule,
    FilesModule,
    SeccionModule,
    RevisionModule,
    ConvocatoriaModule,
    FirebaseModule,
    NotificacionesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
