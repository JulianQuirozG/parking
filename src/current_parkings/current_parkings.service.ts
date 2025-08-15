import { Injectable } from '@nestjs/common';
import { CreateCurrentParkingDto } from './dto/create-current_parking.dto';
import { UpdateCurrentParkingDto } from './dto/update-current_parking.dto';

@Injectable()
export class CurrentParkingsService {
  create(createCurrentParkingDto: CreateCurrentParkingDto) {
    return 'This action adds a new currentParking';
  }

  findAll() {
    return `This action returns all currentParkings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} currentParking`;
  }

  update(id: number, updateCurrentParkingDto: UpdateCurrentParkingDto) {
    return `This action updates a #${id} currentParking`;
  }

  remove(id: number) {
    return `This action removes a #${id} currentParking`;
  }
}
