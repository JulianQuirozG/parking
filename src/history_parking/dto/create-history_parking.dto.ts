import { Parking } from 'src/parkings/entities/parking.entity';

export class CreateHistoryParkingDto {
  id: number;

  plate: string;

  initDay: Date;

  finishDay: Date;

  Amount: number;

  parking: Parking;
}
