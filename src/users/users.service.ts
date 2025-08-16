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

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async create(createUserDto: CreateUserDto) {
    const userExist = await this.findOneByEmail(createUserDto.email);
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
    try {
      if (!id) {
        throw new BadRequestException();
      }
      const user = await this.userRepository.findOne({ where: { id: id } });

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
      let user: User | null = null;
      user = await this.userRepository.findOne({
        where: { email: email.toLocaleLowerCase().trim() },
      });

      if (!user) {
        throw new NotFoundException(`User with email '${email}' not found`);
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException();
    }
  }

  async createAdmin() {
    const userExist = await this.findOneByEmail('admin@mail.com');
    if (userExist) {
      throw new ConflictException('El email ya está registrado');
    }
    try {
      const user = this.userRepository.create({
        name: 'Admin',
        email: 'admin@mail.com',
        type: ROL.ADMIN,
        password: bcrypt.hashSync('admin', 10),
      });
      return await this.userRepository.save(user);
    } catch {
      throw new ConflictException('El email ya está registrado');
    }
  }
}
