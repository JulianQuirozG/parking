import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { ROL } from './enum/users.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async onModuleInit() {
    await this.createAdmin();
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async create(createUserDto: CreateUserDto) {
    const userExist = await this.userRepository.findOne({
      where: { email: createUserDto.email.toLocaleLowerCase().trim() },
    });
    if (userExist) {
      throw new ConflictException('El email ya está registrado');
    }
    try {
      const user = this.userRepository.create({
        name: createUserDto.name,
        email: createUserDto.email,
        type: ROL.SOCIO,
        password: bcrypt.hashSync(createUserDto.password, 10),
      });
      return await this.userRepository.save(user);
    } catch {
      throw new BadRequestException();
    }
  }

  async findOne(id: number): Promise<User> {
    if (!id) {
      throw new BadRequestException('Id is required');
    }

    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .where('user.id = :id', { id })
        .getOne();

      if (!user) {
        throw new NotFoundException(`User with id '${id}' not found`);
      }
      return user;
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException();
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      if (!email) {
        throw new BadRequestException('Email is required');
      }

      const user = await this.userRepository
        .createQueryBuilder('user')
        .where('LOWER(TRIM(user.email)) = :email', {
          email: email.toLowerCase().trim(),
        })
        .getOne();

      if (!user) {
        throw new NotFoundException(`User with email '${email}' not found`);
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Invalid request');
    }
  }

  async createAdmin() {
    const userExist = await this.userRepository.findOne({
      where: { email: 'admin@mail.com' },
    });
    if (userExist) {
      console.log('Usuario admin ya está registrado');
      return;
    }
    try {
      const user = this.userRepository.create({
        name: 'Admin',
        email: 'admin@mail.com',
        type: ROL.ADMIN,
        password: bcrypt.hashSync('admin', 10),
      });
      const admin = await this.userRepository.save(user);
      console.log('Usuario admin registrado correctamente');
      return admin;
    } catch {
      console.log('Usuario admin ya está registrado');
    }
  }
}
