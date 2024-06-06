import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
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
        throw new UnauthorizedException('Usuario not found');
      } else if (user.contrasena !== pass) {
        throw new UnauthorizedException('Contrasena equivocada');
      } else {
        console.log('pasate');
        const payLoad = { user };
        return {
          access_token: await this.jwtService.signAsync(payLoad),
        };
      }
    } catch (err) {
      console.log(err);
      Logger.error(err);
    }

    // if (user?.contrasena !== pass) {
    //   throw new UnauthorizedException();
    // }

    // const { ...result } = user;
    // return result;
  }
}
