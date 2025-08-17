import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { HistoryParkingService } from './history_parking.service';
import { CreateHistoryParkingDto } from './dto/create-history_parking.dto';
import { RoleProtected } from 'src/auth/decorators/user-role.decorator';
import { ROL } from 'src/users/enum/users.enum';
import { EarningsParkingGuard } from './guards/earnings.guard';
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

  @Get('/plate/:id')
  async findOne(@Param('id') id: string) {
    return await this.historyParkingService.findOne(+id);
  }
  /* 
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHistoryParkingDto: UpdateHistoryParkingDto) {
    return this.historyParkingService.update(+id, updateHistoryParkingDto);
  }
*/
  @Get('/TopVehicles')
  async topVehicles() {
    return await this.historyParkingService.TopTenVehicles();
  }

  @Get('/firstTime/:id')
  async firstTime(@Param('id') parkingId: number) {
    return await this.historyParkingService.firstTimeVehicles(+parkingId);
  }

  @Get('/TopVehicles/:id')
  async topVehiclesByPlate(@Param('id') parkingId: number) {
    return await this.historyParkingService.TopTenVehicles(+parkingId);
  }

  @RoleProtected(ROL.SOCIO)
  @UseGuards(EarningsParkingGuard)
  @Get('/Earnings/:id')
  async earningsByParkingId(@Param('id') parkingId: number) {
    return await this.historyParkingService.earnings(+parkingId);
  }
}
