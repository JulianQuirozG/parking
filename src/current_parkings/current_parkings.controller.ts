import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CurrentParkingsService } from './current_parkings.service';
import { CreateCurrentParkingDto } from './dto/create-current_parking.dto';
import { UpdateCurrentParkingDto } from './dto/update-current_parking.dto';

@Controller('current-parkings')
export class CurrentParkingsController {
  constructor(
    private readonly currentParkingsService: CurrentParkingsService,
  ) {}

  @Post()
  create(@Body() createCurrentParkingDto: CreateCurrentParkingDto) {
    return this.currentParkingsService.create(createCurrentParkingDto);
  }

  @Get()
  findAll() {
    return this.currentParkingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.currentParkingsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCurrentParkingDto: UpdateCurrentParkingDto,
  ) {
    return this.currentParkingsService.update(+id, updateCurrentParkingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.currentParkingsService.remove(+id);
  }
}
