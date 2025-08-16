import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { HistoryParkingService } from './history_parking.service';
import { CreateHistoryParkingDto } from './dto/create-history_parking.dto';
//import { UpdateHistoryParkingDto } from './dto/update-history_parking.dto';

@Controller('history-parking')
export class HistoryParkingController {
  constructor(private readonly historyParkingService: HistoryParkingService) {}

  @Post()
  create(@Body() createHistoryParkingDto: CreateHistoryParkingDto) {
    return this.historyParkingService.create(createHistoryParkingDto);
  }

  @Get()
  findAll() {
    return this.historyParkingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.historyParkingService.findOne(+id);
  }
  /* 
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHistoryParkingDto: UpdateHistoryParkingDto) {
    return this.historyParkingService.update(+id, updateHistoryParkingDto);
  }
*/
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.historyParkingService.remove(+id);
  }
}
