import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { loginDto } from './dto/login-user.dto';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() userData: loginDto) {
    return this.authService.login(userData);
  }
}
