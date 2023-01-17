import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserI } from 'src/modules/user/interfaces/user.interface';
import { User } from 'src/modules/user/schemas/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<UserI>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('jwtSecret'),
    });
  }

  async validate(payload: { sub: string }) {
    const user = await this.userModel.findOne({ _id: payload.sub });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}