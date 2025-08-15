import { Module } from '@nestjs/common';
import { CurrentParkingsService } from './current_parkings.service';
import { CurrentParkingsController } from './current_parkings.controller';

@Module({
  controllers: [CurrentParkingsController],
  providers: [CurrentParkingsService],
})
export class CurrentParkingsModule {}
