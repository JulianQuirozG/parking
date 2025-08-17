import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

import { ROL } from 'src/users/enum/users.enum';
import { META_ROLES } from '../decorators/user-role.decorator';
import { AuthUser } from '../../common/interfaces/authUser.interface';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<ROL[]>(META_ROLES, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    const req = context.switchToHttp().getRequest<{ user?: AuthUser }>();
    const user = req.user as AuthUser; // aquí le decimos que req.user es AuthUser

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return requiredRoles.some((role) => user.role === role);
  }
}
