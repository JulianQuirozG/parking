import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { loginDto } from './dto/login-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(userData: loginDto) {
    const { password } = userData;
    const email = userData.email.toLowerCase().trim();
    const user = await this.userService.findOneByEmail(email);
    if (!user) throw new NotFoundException({ message: `${email} don't exist` });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user.id, username: user.name, role: user.type };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
