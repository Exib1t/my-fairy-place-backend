import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { phone: string }) {
    return this.authService.register(body.phone);
  }

  @Post('verify-registration')
  @HttpCode(HttpStatus.OK)
  async verifyRegistration(@Body() body: { phone: string; code: string }) {
    return this.authService.verifyRegistration(body.phone, body.code);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: { phone: string; code: string }) {
    return this.authService.login(body.phone, body.code);
  }
}
