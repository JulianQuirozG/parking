import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CurrentParkingsService } from './current_parkings.service';
import { CurrentParkingDto } from './dto/create-current_parking.dto';
import { RoleProtected } from 'src/auth/decorators/user-role.decorator';
import { ROL } from 'src/users/enum/users.enum';

@Controller('current-parkings')
export class CurrentParkingsController {
  constructor(
    private readonly currentParkingsService: CurrentParkingsService,
  ) {}
  @Post()
  create(@Body() createCurrentParkingDto: CurrentParkingDto) {
    return this.currentParkingsService.create(createCurrentParkingDto);
  }
  @RoleProtected(ROL.SOCIO)
  @Get()
  findAll() {
    return this.currentParkingsService.findAll();
  }

  @Get(':plate')
  findOne(@Param('plate') plate: string) {
    return this.currentParkingsService.findByPlateLike(plate);
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
  @Post('out')
  remove(@Body() checkoutCurrentParkingDto: CurrentParkingDto) {
    return this.currentParkingsService.checkout(checkoutCurrentParkingDto);
  }
}
