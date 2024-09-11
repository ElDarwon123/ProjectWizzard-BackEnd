import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { RolesEnum } from 'src/enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private refletor: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const roles = this.refletor.getAllAndOverride<RolesEnum[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

      if (!roles) return true;

      const request = context.switchToHttp().getRequest();
      let { user } = request;

      if (user instanceof Promise) {
        user = await user;
      }

      return roles.includes(user.role);
    } catch (error) {
      throw new UnauthorizedException('Invalid role');
    }
  }
}
