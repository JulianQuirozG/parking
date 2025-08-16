import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateHistoryParkingDto } from './dto/create-history_parking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { HistoryParking } from './entities/history_parking.entity';
import { Repository } from 'typeorm';
import moment from 'moment-timezone';
import { ParkingsService } from '../parkings/parkings.service';

@Injectable()
export class HistoryParkingService {
  constructor(
    @InjectRepository(HistoryParking)
    private historyParkingRepository: Repository<HistoryParking>,
    private parkingsService: ParkingsService,
  ) {}
  async create(createHistoryParkingDto: CreateHistoryParkingDto) {
    const exist = await this.historyParkingRepository.findOne({
      where: { id: createHistoryParkingDto.id },
    });
    if (exist) {
      throw new BadRequestException();
    }
    const today = moment().tz('America/Bogota');

    const parking = await this.parkingsService.findOne(
      createHistoryParkingDto.parking.id,
    );
    const diff: number =
      today.diff(createHistoryParkingDto.initDay) / (1000 * 60 * 60);
    const amount = diff * parking.costperhour;
    const history = this.historyParkingRepository.create({
      id: createHistoryParkingDto.id,
      initDay: createHistoryParkingDto.initDay,
      parking: createHistoryParkingDto.parking,
      plate: createHistoryParkingDto.plate,
      finishDay: today.toDate(),
      Amount: amount,
    });
    try {
      const saved = await this.historyParkingRepository.save(history);
      return saved;
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  async findAll() {
    return await this.historyParkingRepository.find();
  }

  async findOne(id: number) {
    if (!id) {
      throw new BadRequestException('El id es requerido');
    }
    const history = await this.historyParkingRepository
      .createQueryBuilder('history')
      .where('history.id = :id', { id })
      .getOne();

    if (!history) {
      throw new NotFoundException(
        `HistoryParking con id '${id}' no encontrado`,
      );
    }

    return history;
  }

  remove(id: number) {
    return `This action removes a #${id} historyParking`;
  }
}
