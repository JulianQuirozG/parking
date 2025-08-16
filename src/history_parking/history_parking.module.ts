import { forwardRef, Module } from '@nestjs/common';
import { HistoryParkingService } from './history_parking.service';
import { HistoryParkingController } from './history_parking.controller';
import { HistoryParking } from './entities/history_parking.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingsModule } from 'src/parkings/parkings.module';
import { CurrentParkingsModule } from 'src/current_parkings/current_parkings.module';
import { CurrentParking } from 'src/current_parkings/entities/current_parking.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([HistoryParking, CurrentParking]),
    ParkingsModule,
    forwardRef(() => CurrentParkingsModule),
  ],
  controllers: [HistoryParkingController],
  providers: [HistoryParkingService],
  exports: [HistoryParkingService],
})
export class HistoryParkingModule {}
