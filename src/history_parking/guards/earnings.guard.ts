import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROL } from 'src/users/enum/users.enum';
import { AuthUser } from 'src/common/interfaces/authUser.interface';
import { ParkingsService } from 'src/parkings/parkings.service';

@Injectable()
export class EarningsParkingGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private parkingsService: ParkingsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // eslint-disable-next-line prettier/prettier
    const req = context.switchToHttp().getRequest<{ user: AuthUser; params: any }>();
    const user: AuthUser = req.user;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    const id = parseInt(req.params.id);
    if (!user) throw new UnauthorizedException();

    // Solo verificamos para SOCIO
    if (user.role === ROL.SOCIO) {
      const record = await this.parkingsService.findOne(+id);
      if (!record || record.partner.id !== +user.sub) {
        throw new ForbiddenException(
          'No tienes permiso para ver este registro',
        );
      }
    }

    // ADMIN o SOCIO con acceso permitido
    return true;
  }
}
