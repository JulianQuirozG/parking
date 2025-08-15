import { PartialType } from '@nestjs/mapped-types';
import { CreateHistoryParkingDto } from './create-history_parking.dto';

export class UpdateHistoryParkingDto extends PartialType(CreateHistoryParkingDto) {}
