import {
  Body,
  Controller,
  Post,
  UseGuards,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { JwtGuard } from 'src/shared/guards/jwt.guard';
import { UserI } from 'src/shared/interfaces/user.interface';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const { access_token } = await this.authService.login(loginDto);
    res.set('Authorization', access_token);

    throw new HttpException('LOGIN_SUCCESS', HttpStatus.OK);
  }

  @Post('logout')
  @UseGuards(JwtGuard)
  async logout(@GetUser() user: UserI): Promise<{ message: string }> {
    return await this.authService.logout(user._id);
  }
}
