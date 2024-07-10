import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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

    try {

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const isMatch = await bcrypt.compare(pass, user.contrasena);

      if (!isMatch) {
        throw new UnauthorizedException('Invalid Credentials');
      }
        console.log(user);
        console.log('pasate');
        const payLoad = { sub: user, role: user.role };
        return {
          access_token: await this.jwtService.signAsync(payLoad),
        };
      
    } catch (err) {
      throw new NotFoundException('Invalid Credentials');
    }
  }
}
