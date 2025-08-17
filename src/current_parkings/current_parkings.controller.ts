/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { CurrentParkingsService } from './current_parkings.service';
import { CurrentParkingDto } from './dto/create-current_parking.dto';
import { findOneDataParking } from './guards/findOneParking.guard';
import { checkOwnerControlParking } from './guards/ParkingControl.guard';
import { SenddMailDto } from './dto/sendEmail.dto';
import { CurrentParkingSearchDto } from './dto/create-current-search_parking.dto';

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

  @Get(':id')
  async findAll(@Param('id') id: number) {
    return await this.currentParkingsService.findAll(+id);
  }

  @Post('plate')
  async findOne(@Body() createCurrentParkingDto: CurrentParkingSearchDto) {
    return await this.currentParkingsService.findByPlateLike(
      createCurrentParkingDto.plate,
      createCurrentParkingDto.parking,
    );
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

  @Post('sendEmail')
  async sendEmail(@Body() sendEmail: SenddMailDto) {
    return await this.currentParkingsService.sendEmail(sendEmail);
  }
}
