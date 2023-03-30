import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'THIS IS A BACKEND API FOR CE BOOSTUP XI. 📢';
  }
}
