import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from 'src/usuario/usuario.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsuarioService,
    private jwtService: JwtService,
  ) {}

  async singIn(email: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.userService.findByEmail(email);
    const validUser = await this.userService.validateUser(email, pass);
    const hash = await bcrypt.hash(pass, 10);
    const isMatch = await bcrypt.compare(pass, hash);

    try {
      if (!user) {
        throw new UnauthorizedException('User not found');
      } else if (!isMatch) {
        throw new UnauthorizedException('Invalid Credentials');
      } else {
        console.log('pasate');
        const payLoad = { sub: user, role: user.role };
        return {
          access_token: await this.jwtService.signAsync(payLoad),
        };
      }
    } catch (err) {
      console.log(err);
      Logger.error(err);
    }
  }
}
