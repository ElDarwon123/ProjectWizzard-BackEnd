/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }
    try {
      const payLoad = this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      if (payLoad instanceof TokenExpiredError) {
        throw new UnauthorizedException('Invalid token expired');
      }
      const isBlacklisted = await this.authService.validateToken(token);
      if (!isBlacklisted) {
        throw new UnauthorizedException('Token ha sido invalidado');
      }
      request['user'] = payLoad;
      return true;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token');
      } else {
        throw new UnauthorizedException('Unauthorized access');
      }
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader) {
        throw new NotFoundException('Token header not found');
      }
      const [type, token] = authHeader.split(' ');
      return type === 'Bearer' ? token : undefined;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token');
      } else {
        throw new UnauthorizedException('Unauthorized access');
      }
    }
  }
}
