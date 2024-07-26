/* eslint-disable prettier/prettier */
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { jwtConstants } from '../constants';
import { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }
    try {
      const payLoad = this.jwtService.verifyAsync(token, {
        secret: jwtConstants,
      });
      const isBlacklisted = await this.authService.validateToken(token);
      if (!isBlacklisted) {
        throw new UnauthorizedException('Token ha sido invalidado');
      }
      request['user'] = payLoad;
      return true;
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw new UnauthorizedException('Invalid token expired');
      }
      throw new UnauthorizedException('Invalid token signature');
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
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Invalid token expired');
      }
      throw new UnauthorizedException('Invalid token signature');
    }
  }
}
