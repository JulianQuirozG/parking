import { PartialType } from '@nestjs/mapped-types';
import { CreateCurrentParkingDto } from './create-current_parking.dto';

export class UpdateCurrentParkingDto extends PartialType(CreateCurrentParkingDto) {}
