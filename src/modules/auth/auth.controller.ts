import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { JwtGuard } from 'src/shared/guards/jwt.guard';
import { UserI } from 'src/shared/interfaces/user.interface';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { TokenI } from './interfaces/jwt.interface';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<TokenI> {
    return await this.authService.login(loginDto);
  }

  @Post('logout')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@GetUser() user: UserI): Promise<{ message: string }> {
    return this.authService.logout(user._id);
  }
}
