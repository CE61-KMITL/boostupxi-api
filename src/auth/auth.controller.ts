import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtGuard } from './guards/jwt.guard';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { Role } from '../shared/enums/role.enum';
import { Roles } from './decorators/role.decorator';
import { RolesGuard } from './guards/roles.guard';
import { PoliciesGuard } from 'src/casl/guard/policies.guard';
import { CheckPolicies } from 'src/casl/decorator/check-policy.decorator';
import { CreateUserPolicyHandler } from 'src/common/policies/create.policy';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies(new CreateUserPolicyHandler())
  @UseGuards(JwtGuard)
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
}
