import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as fsPromises from 'fs/promises';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const dateTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    const message = `${req.method}\t${req.originalUrl}\t${res.statusCode}`;
    const logMessage = `${dateTime}\t${uuidv4()}\t${message}\n`;
    try {
      if (!fs.existsSync(path.join(__dirname, `../../../logs`))) {
        await fsPromises.mkdir(path.join(__dirname, `../../../logs`));
      }

      await fsPromises.appendFile(
        path.join(__dirname, `../../../logs/reqLog.log`),
        logMessage,
      );
    } catch (error) {
      console.log(error);
    }
    next();
  }
}
