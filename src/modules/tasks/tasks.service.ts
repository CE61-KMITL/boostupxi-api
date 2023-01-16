import { Injectable } from "@nestjs/common";

@Injectable()
export class TasksService {
  sayHello() {
    return 'Hello World!';
  }
}
