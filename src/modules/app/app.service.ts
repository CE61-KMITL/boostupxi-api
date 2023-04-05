import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'This is a backend API for CE BoostUp XI. 📢';
  }
}
