import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dtos/register.dto';
import { JwtGuard } from '@/common/guards/jwt.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/common/enums/role.enum';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const token = await this.authService.login(loginDto);
    res.setHeader('Authorization', token);
    return res.send({
      message: 'LOGIN_SUCCESS',
    });
  }

  @Post('register')
  @UseGuards(JwtGuard)
  @Roles(Role.Admin)
  async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
    const token = await this.authService.register(registerDto);
    res.setHeader('Authorization', token);
    return res.send({
      message: 'REGISTER_SUCCESS',
    });
  }
}
