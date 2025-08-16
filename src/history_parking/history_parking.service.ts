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
import { CurrentParking } from 'src/current_parkings/entities/current_parking.entity';
import { countPlates, SumKpi } from './interfaces/kpi-plates.interface';

@Injectable()
export class HistoryParkingService {
  constructor(
    @InjectRepository(HistoryParking)
    private historyParkingRepository: Repository<HistoryParking>,
    @InjectRepository(CurrentParking)
    private currentParkingRepository: Repository<CurrentParking>,
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

  //Indicadores
  async TopTenVehicles(parkingId?: number) {
    // Subconsulta para HistoryParking
    const historySubquery = this.historyParkingRepository
      .createQueryBuilder('h')
      .select('h.plate', 'plate')
      .addSelect('COUNT(*)', 'count')
      .groupBy('h.plate');

    if (parkingId) {
      historySubquery.where('h.parkingId = :parkingId', { parkingId });
    }
    // Subconsulta para CurrentParking
    const currentSubquery = this.currentParkingRepository
      .createQueryBuilder('c')
      .select('c.plate', 'plate')
      .addSelect('COUNT(*)', 'count')
      .groupBy('c.plate');

    if (parkingId) {
      currentSubquery.where('c.parkingId = :parkingId', { parkingId });
    }

    // Ejecutamos ambas subconsultas
    const historyResults: countPlates[] = await historySubquery.getRawMany();
    const currentResults: countPlates[] = await currentSubquery.getRawMany();

    // Combinamos resultados en memoria
    const combinedMap = new Map<string, number>();

    [...historyResults, ...currentResults].forEach((r) => {
      const prev = combinedMap.get(r.plate) || 0;
      combinedMap.set(r.plate, prev + parseInt(r.count));
    });

    // Ordenamos y tomamos top 10
    const top10 = Array.from(combinedMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([plate, count]) => ({ plate, count }));

    return top10;
  }

  async firstTimeVehicles(parkingId: number) {
    const qb = this.currentParkingRepository.createQueryBuilder('c');
    const vehicles: countPlates[] = await qb
      .leftJoin(
        'history_parking',
        'h',
        'h.plate = c.plate AND h.parkingId = :parkingId',
        { parkingId },
      )
      .where('c.parkingId = :parkingId', { parkingId })
      .andWhere('h.id IS NULL') // no tiene historial previo
      .select('c.plate', 'plate')
      .getRawMany();

    return vehicles;
  }

  async earnings(parkingId: number) {
    const now = moment().tz('America/Bogota');

    // Fechas
    const startOfDay = now.clone().startOf('day').toDate();
    const startOfWeek = now.clone().startOf('week').toDate();
    const startOfMonth = now.clone().startOf('month').toDate();
    const startOfYear = now.clone().startOf('year').toDate();

    const endOfDay = now.clone().endOf('day').toDate();
    const endOfWeek = now.clone().endOf('week').toDate();
    const endOfMonth = now.clone().endOf('month').toDate();
    const endOfYear = now.clone().endOf('year').toDate();

    // Helper para sumar montos
    const sumAmount = async (start: Date, end: Date) => {
      const sum: SumKpi | undefined = await this.historyParkingRepository
        .createQueryBuilder('h')
        .select('SUM(h.Amount)', 'sum')
        .where('h.parkingId = :parkingId', { parkingId })
        .andWhere('h.finishDay BETWEEN :start AND :end', { start, end })
        .getRawOne();

      return sum ? parseFloat(String(sum.sum)) : 0;
    };

    return {
      today: await sumAmount(startOfDay, endOfDay),
      week: await sumAmount(startOfWeek, endOfWeek),
      month: await sumAmount(startOfMonth, endOfMonth),
      year: await sumAmount(startOfYear, endOfYear),
    };
  }
}
