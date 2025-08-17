import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateParkingDto } from './dto/create-parking.dto';
import { UpdateParkingDto } from './dto/update-parking.dto';
import { Repository } from 'typeorm';
import { Parking } from './entities/parking.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { User } from 'src/users/entities/user.entity';
import { AuthUser } from 'src/common/interfaces/authUser.interface';

@Injectable()
export class ParkingsService {
  constructor(
    @InjectRepository(Parking)
    private parkingRepository: Repository<Parking>,
    private usersService: UsersService,
  ) {}

  async create(createParkingDto: CreateParkingDto) {
    try {
      let partner: User | undefined;
      if (createParkingDto.partner) {
        partner = await this.usersService.findOne(createParkingDto.partner);
      }

      const parking = this.parkingRepository.create({
        name: createParkingDto.name,
        location: createParkingDto.location,
        capacity: createParkingDto.capacity,
        costperhour: createParkingDto.costperhour,
        partner: partner,
      });
      return await this.parkingRepository.save(parking);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException();
    }
  }

  async findAll() {
    try {
      return await this.parkingRepository.find({ relations: ['partner'] });
    } catch {
      throw new BadRequestException();
    }
  }

  async findAllByUser(user: AuthUser) {
    const userExist = await this.usersService.findOne(+user.sub);
    try {
      return await this.parkingRepository.find({
        where: { partner: userExist },
        relations: ['partner'],
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async findOne(id: number) {
    try {
      if (!id) throw new BadRequestException();
      const parking = await this.parkingRepository.findOne({
        where: { id: id },
        relations: ['partner', 'current'],
      });

      if (!parking) {
        throw new NotFoundException(`Parking with id '${id}' not found`);
      }
      return parking;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException();
    }
  }

  async update(id: number, updateParkingDto: UpdateParkingDto) {
    try {
      const parking = await this.findOne(id);

      if (updateParkingDto.partner) {
        const user = await this.usersService.findOne(+updateParkingDto.partner);
        parking.partner = user;
      }
      Object.assign(parking, updateParkingDto);
      return await this.parkingRepository.save(parking);
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException();
    }
  }

  async remove(id: number) {
    await this.findOne(+id);
    try {
      const parking = await this.findOne(id);
      return await this.parkingRepository.remove(parking);
    } catch {
      throw new BadRequestException();
    }
  }
}
