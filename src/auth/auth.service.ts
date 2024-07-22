import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from 'src/usuario/usuario.service';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { BlackList } from './schema/auth.entity';
import { Model } from 'mongoose';
import { CreateBlackList } from './dto/create-blackList.dto';
import { MailerService } from '@nestjs-modules/mailer';


@Injectable()
export class AuthService {
  constructor(
    private userService: UsuarioService,
    private jwtService: JwtService,
    private mailerService: MailerService,
    @InjectModel(BlackList.name) private readonly blackList: Model<BlackList>,
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

  async logOut(token: CreateBlackList) {
    const tokenInBl = new this.blackList(token);
    await tokenInBl.save();
    return tokenInBl;
  }

  async validateToken(token: string): Promise<boolean> {
    const tokenInBlackList = await this.blackList.findOne({ token });
    if (tokenInBlackList) {
      throw new UnauthorizedException('Invalid token');
    }
    return true;
  }

  async sendPassWordResetEmail(email: string): Promise<void> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = await this.jwtService.sign(
      { email: user.email },
      { expiresIn: '1h' },
    );

    const resetUrl = `http://your-frontend-domain.com/reset-password?token=${token}`;

    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Password reset',
        template: 'reset-password',
        context: {
          name: user.nombre,
          resetUrl,
          token: token,
        },
      });
    } catch (error) {
      console.error(error);
      
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    let email: string;
    try {
      const decoded = await this.jwtService.verifyAsync(token);
      email = decoded.email;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const user = this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    (await user).contrasena = await bcrypt.hash(newPassword, 10);
    (await user).save();
  }
}
