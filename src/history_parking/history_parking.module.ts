import { Module } from '@nestjs/common';
import { HistoryParkingService } from './history_parking.service';
import { HistoryParkingController } from './history_parking.controller';

@Module({
  controllers: [HistoryParkingController],
  providers: [HistoryParkingService],
})
export class HistoryParkingModule {}
