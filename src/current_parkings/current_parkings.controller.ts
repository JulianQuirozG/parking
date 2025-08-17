import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { CurrentParkingsService } from './current_parkings.service';
import { CurrentParkingDto } from './dto/create-current_parking.dto';
import { findOneDataParking } from './guards/findOneParking.guard';
import { checkOwnerControlParking } from './guards/ParkingControl.guard';

@Controller('current-parkings')
export class CurrentParkingsController {
  constructor(
    private readonly currentParkingsService: CurrentParkingsService,
  ) {}
  @UseGuards(checkOwnerControlParking)
  @Post()
  async create(@Body() createCurrentParkingDto: CurrentParkingDto) {
    return await this.currentParkingsService.create(createCurrentParkingDto);
  }

  @Get()
  async findAll() {
    return await this.currentParkingsService.findAll();
  }

  @Get('plate/:plate')
  async findOne(@Param('plate') plate: string) {
    return await this.currentParkingsService.findByPlateLike(plate);
  }

  @UseGuards(findOneDataParking)
  @Get('data/:id')
  async findOneData(@Param('id') id: number) {
    return await this.currentParkingsService.findOne(+id);
  }
  /*
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCurrentParkingDto: UpdateCurrentParkingDto,
  ) {
    return this.currentParkingsService.update(+id, updateCurrentParkingDto);
  }
*/
  @UseGuards(checkOwnerControlParking)
  @Post('out')
  async remove(@Body() checkoutCurrentParkingDto: CurrentParkingDto) {
    return await this.currentParkingsService.checkout(
      checkoutCurrentParkingDto,
    );
  }
}
