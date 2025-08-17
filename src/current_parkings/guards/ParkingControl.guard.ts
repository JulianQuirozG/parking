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
import { CurrentParkingsService } from '../current_parkings.service';
import { ParkingsService } from 'src/parkings/parkings.service';
import { CurrentParkingDto } from '../dto/create-current_parking.dto';

@Injectable()
export class checkOwnerControlParking implements CanActivate {
  constructor(
    private reflector: Reflector,
    private currentParkingsService: CurrentParkingsService,
    private parkingsService: ParkingsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // eslint-disable-next-line prettier/prettier
    const req = context.switchToHttp().getRequest<{ user: AuthUser; params: any; body: CurrentParkingDto }>();
    const user: AuthUser = req.user;
    const parkingId = req.body.parking;

    if (!user) throw new UnauthorizedException();

    // Solo verificamos para SOCIO
    if (user.role === ROL.SOCIO) {
      const parking = await this.parkingsService.findOne(+parkingId);
      if (!parking || parking.partner.id !== +user.sub) {
        throw new ForbiddenException(
          'No estás registrado como socio en este parqueadero',
        );
      }
    }

    // ADMIN o SOCIO con acceso permitido
    return true;
  }
}
