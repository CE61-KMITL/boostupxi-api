import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Res,
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
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const { access_token } = await this.authService.login(loginDto);
    res.set('Authorization', access_token);

    return res.json({
      message: 'Login was successful !',
    });
  }

  @Post('logout')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@GetUser() user: UserI): Promise<{ message: string }> {
    return await this.authService.logout(user._id);
  }
}
