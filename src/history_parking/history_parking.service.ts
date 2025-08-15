import { Injectable } from '@nestjs/common';
import { CreateHistoryParkingDto } from './dto/create-history_parking.dto';
import { UpdateHistoryParkingDto } from './dto/update-history_parking.dto';

@Injectable()
export class HistoryParkingService {
  create(createHistoryParkingDto: CreateHistoryParkingDto) {
    return 'This action adds a new historyParking';
  }

  findAll() {
    return `This action returns all historyParking`;
  }

  findOne(id: number) {
    return `This action returns a #${id} historyParking`;
  }

  update(id: number, updateHistoryParkingDto: UpdateHistoryParkingDto) {
    return `This action updates a #${id} historyParking`;
  }

  remove(id: number) {
    return `This action removes a #${id} historyParking`;
  }
}
