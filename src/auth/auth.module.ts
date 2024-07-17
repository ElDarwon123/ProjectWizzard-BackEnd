import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { SharedModule } from 'src/shared.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants,
      signOptions: { expiresIn: '5h' },
    }),
    UsuarioModule,
    SharedModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
