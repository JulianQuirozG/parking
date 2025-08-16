import { Module } from '@nestjs/common';
import { HistoryParkingService } from './history_parking.service';
import { HistoryParkingController } from './history_parking.controller';
import { HistoryParking } from './entities/history_parking.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([HistoryParking])],
  controllers: [HistoryParkingController],
  providers: [HistoryParkingService],
  exports: [HistoryParkingService],
})
export class HistoryParkingModule {}
