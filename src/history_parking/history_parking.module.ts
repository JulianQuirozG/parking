import { Module } from '@nestjs/common';
import { HistoryParkingService } from './history_parking.service';
import { HistoryParkingController } from './history_parking.controller';
import { HistoryParking } from './entities/history_parking.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingsModule } from 'src/parkings/parkings.module';

@Module({
  imports: [TypeOrmModule.forFeature([HistoryParking]), ParkingsModule],
  controllers: [HistoryParkingController],
  providers: [HistoryParkingService],
  exports: [HistoryParkingService],
})
export class HistoryParkingModule {}
