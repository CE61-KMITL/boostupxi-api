import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserI } from 'src/shared/interfaces/user.interface';
import { User } from 'src/modules/user/schemas/user.schema';
import { JwtPayloadI } from '../interfaces/jwt.interface';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<UserI>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('jwtSecret'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayloadI): Promise<UserI> {
    const token = req.get('Authorization').split(' ')[1];

    const user = await this.userModel.findOne({ _id: payload.sub });
    if (!user) {
      throw new UnauthorizedException();
    }

    if (!user.token || user.token !== token) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
