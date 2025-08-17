/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ParkingsService } from './parkings.service';
import { CreateParkingDto } from './dto/create-parking.dto';
import { UpdateParkingDto } from './dto/update-parking.dto';
import { RoleProtected } from 'src/auth/decorators/user-role.decorator';
import { ROL } from 'src/users/enum/users.enum';
import { findOneParking } from './guards/findOneParking.guard';

@Controller('parkings')
export class ParkingsController {
  constructor(private readonly parkingsService: ParkingsService) {}
  @RoleProtected(ROL.ADMIN)
  @Post()
  async create(@Body() createParkingDto: CreateParkingDto) {
    return await this.parkingsService.create(createParkingDto);
  }

  @RoleProtected(ROL.ADMIN)
  @Get()
  async findAll() {
    return await this.parkingsService.findAll();
  }

  @Get('user')
  async findAllByUser(@Req() req) {
    return await this.parkingsService.findAllByUser(req.user);
  }

  @UseGuards(findOneParking)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.parkingsService.findOne(+id);
  }

  @RoleProtected(ROL.ADMIN)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateParkingDto: UpdateParkingDto,
  ) {
    return await this.parkingsService.update(+id, updateParkingDto);
  }

  @RoleProtected(ROL.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.parkingsService.remove(+id);
  }
}
