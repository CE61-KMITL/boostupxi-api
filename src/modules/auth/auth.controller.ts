import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res() res: Response,
  ): Promise<Response> {
    const token = await this.authService.login(loginDto);
    res.setHeader('Authorization', token);
    return res.send({
      message: 'LOGIN_SUCCESS',
    });
  }
}
