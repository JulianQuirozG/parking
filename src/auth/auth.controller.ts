import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { loginDto } from './dto/login-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() userData: loginDto) {
    return this.authService.login(userData);
  }
}
