import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsuarioModule } from './usuario/usuario.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleModule } from './role/role.module';


@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true
  }),
    UsuarioModule,
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('URI')
        
      })
    }),
    RoleModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
