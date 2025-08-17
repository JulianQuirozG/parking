/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CurrentParkingDto } from './dto/create-current_parking.dto';
import { ParkingsService } from 'src/parkings/parkings.service';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrentParking } from './entities/current_parking.entity';
import { Repository } from 'typeorm';
import { HistoryParkingService } from 'src/history_parking/history_parking.service';
import moment from 'moment-timezone';
import { SenddMailDto } from 'src/current_parkings/dto/sendEmail.dto';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class CurrentParkingsService {
  constructor(
    @InjectRepository(CurrentParking)
    private parkingCurrentRepository: Repository<CurrentParking>,
    private parkingsService: ParkingsService,
    private historyParkingService: HistoryParkingService,
    private httpService: HttpService,
  ) {}
  async create(currentParkingDto: CurrentParkingDto) {
    // 1. Validar si la placa ya está en algun parqueadero
    const exist = await this.parkingCurrentRepository.findOne({
      where: { plate: currentParkingDto.plate },
    });
    if (exist) {
      throw new BadRequestException({
        message: `No se puede Registrar Ingreso, ya existe la placa en este u otro parqueadero`,
      });
    }

    // 2. Validar que el parqueadero exista
    const parkingExist = await this.parkingsService.findOne(
      currentParkingDto.parking,
    );

    //3. Validar disponibilidad en el parqueadero
    const isValid = await this.parkingCurrentRepository.countBy({
      parking: parkingExist,
    });
    if (isValid >= parkingExist.capacity) {
      throw new BadRequestException(`El parqueadero ya alcanzó su cupo maximo`);
    }

    // 4. Crear registro
    try {
      const current = this.parkingCurrentRepository.create({
        plate: currentParkingDto.plate,
        parking: parkingExist,
        initDay: moment().tz('America/Bogota').toDate(),
      });
      const created = await this.parkingCurrentRepository.save(current);
      return { id: created.id };
    } catch {
      throw new BadRequestException();
    }
  }

  async findAll(id: number) {
    const result = await this.parkingCurrentRepository
      .createQueryBuilder('pc') // alias de ParkingCurrent
      .leftJoinAndSelect('pc.parking', 'p') // relación
      .where('p.id = :id', { id }) // condición
      .getMany();

    return result.map((item) => ({
      ...item,
      initDay: moment(item.initDay)
        .tz('America/Bogota')
        .format('YYYY-MM-DD HH:mm:ss'),
    }));
  }

  async findOne(id: number): Promise<CurrentParking> {
    console.log(id);
    if (!id) {
      throw new BadRequestException();
    }
    const current = await this.parkingCurrentRepository.findOne({
      where: { id: id },
      relations: ['parking'],
    });

    if (!current) {
      throw new NotFoundException();
    }

    return current;
  }

  async findByPlateLike(
    plate: string,
    parkingId?: number,
  ): Promise<CurrentParking[]> {
    if (!plate) {
      throw new BadRequestException('La placa es obligatoria');
    }

    const query = this.parkingCurrentRepository
      .createQueryBuilder('current')
      .leftJoinAndSelect('current.parking', 'parking')
      .where('current.plate LIKE :plate', { plate: `%${plate}%` });

    if (parkingId) {
      query.andWhere('parking.id = :parkingId', { parkingId });
    }

    const results = await query.getMany();

    if (!results || results.length === 0) {
      throw new NotFoundException(
        `No se encontraron vehículos con coincidencia en la placa '${plate}'${parkingId ? ` en el parqueadero ${parkingId}` : ''}`,
      );
    }

    return results;
  }

  async findOneByPlate(
    plate: string,
    parkingId?: number,
  ): Promise<CurrentParking> {
    //1. Validar que exista la placa
    if (!plate) {
      throw new BadRequestException('La placa es obligatoria');
    }

    const query = this.parkingCurrentRepository
      .createQueryBuilder('current')
      .leftJoinAndSelect('current.parking', 'parking')
      .where('current.plate = :plate', { plate }); // 👈 coincidencia exacta

    if (parkingId) {
      //1. Validar que el parqueadero exista
      const parkingExist = await this.parkingsService.findOne(parkingId);
      if (!parkingExist) {
        throw new BadRequestException({
          message: `El parqueadero no existe`,
        });
      }
      query.andWhere('parking.id = :parkingId', { parkingId });
    }

    const results = await query.getOne();

    if (!results) {
      throw new NotFoundException(
        `No se encontraron vehículos con la placa '${plate}'${parkingId ? ` en el parqueadero ${parkingId}` : ''}`,
      );
    }

    return results;
  }

  async checkout(currentParkingDto: CurrentParkingDto) {
    // 1. Validar si la placa ya está en algun parqueadero
    const currentExist = await this.findOneByPlate(
      currentParkingDto.plate,
      currentParkingDto.parking,
    );
    if (!currentExist) {
      throw new BadRequestException({
        message: `No se puede Registrar Salida, no existe la placa en el parqueadero"`,
      });
    }
    try {
      const createHistory = await this.historyParkingService.create({
        id: currentExist.id,
        plate: currentExist.plate,
        initDay: currentExist.initDay,
        parking: currentExist.parking,
        Amount: 0,
        finishDay: moment().tz('America/Bogota').toDate(),
      });

      if (createHistory) {
        await this.parkingCurrentRepository.delete(currentExist);
        return { mensaje: 'Salida registrada' };
      }
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  async sendEmail(emailParams: SenddMailDto) {
    const exist = await this.findOneByPlate(
      emailParams.placa,
      emailParams.parqueaderoId,
    );
    const url = 'http://localhost:3001/mail';
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          url,
          {
            email: emailParams.email,
            placa: emailParams.placa,
            mensaje: emailParams.mensaje,
            parqueaderoNombre: exist.parking.name,
          },
          {
            headers: { 'Content-Type': 'application/json' },
            timeout: 5000,
          },
        ),
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        {
          message: 'Error enviando correo',
          error: error.response?.data || error.message,
        },
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
