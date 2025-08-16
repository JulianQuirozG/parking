import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('')
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @UseGuards(AuthGuard)
  @Post('')
  async create(@Body() usario: CreateUserDto): Promise<User> {
    return await this.usersService.create(usario);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return await this.usersService.findOne(+id);
  }

  @Get('email/:email')
  async findOneByEmail(@Param('email') email: string): Promise<User> {
    return await this.usersService.findOneByEmail(email);
  }
}
