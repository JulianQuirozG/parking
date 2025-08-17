import { forwardRef, Module } from '@nestjs/common';
import { CurrentParkingsService } from './current_parkings.service';
import { CurrentParkingsController } from './current_parkings.controller';
import { CurrentParking } from './entities/current_parking.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingsModule } from 'src/parkings/parkings.module';
import { HistoryParkingModule } from 'src/history_parking/history_parking.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([CurrentParking]),
    ParkingsModule,
    forwardRef(() => HistoryParkingModule),
    HttpModule,
  ],
  controllers: [CurrentParkingsController],
  providers: [CurrentParkingsService],
  exports: [CurrentParkingsService],
})
export class CurrentParkingsModule {}
