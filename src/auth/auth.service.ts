import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from 'src/usuario/usuario.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsuarioService,
    private jwtService: JwtService,
  ) {}

  async singIn(email: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.userService.findByEmail(email);
    try {
      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      } else if (user.contrasena !== pass) {
        throw new UnauthorizedException('Contraseña incorrecta');
      } else {
        console.log('pasate');
        const payLoad = { email: user.email, password: user.contrasena };
        return {
          access_token: await this.jwtService.signAsync(payLoad),
        };
      }
    } catch (err) {
      console.log(err);
    }

    // if (user?.contrasena !== pass) {
    //   throw new UnauthorizedException();
    // }

    // const { ...result } = user;
    // return result;
  }
}
