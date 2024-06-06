import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
// import { APP_GUARD } from '@nestjs/core';
// import { AuthGuard } from './auth.guard';

@Module({
  imports: [
    UsuarioModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
