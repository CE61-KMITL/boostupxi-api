import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');
  private readonly logFile: string;

  constructor() {
    const logDirectory = path.join(__dirname, '../../../logs');
    this.logFile = path.join(logDirectory, 'reqLog.log');
    this.createLogDirectory(logDirectory);
  }

  private createLogDirectory(logDirectory: string): void {
    if (!fs.existsSync(logDirectory)) {
      fs.mkdirSync(logDirectory, { recursive: true });
    }
  }

  async use(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    const { ip, method, originalUrl, headers } = request;
    const userAgent = headers['user-agent'] || '';
    const dateTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');
      const logMessage = `${dateTime}\t${uuidv4()}\t${method}\t${originalUrl}\t${statusCode}\t${contentLength}\t${userAgent}\t${ip}\n`;
      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
      );
      try {
        fs.appendFileSync(this.logFile, logMessage);
      } catch (error) {
        console.error('Error while writing log file');
      }
    });

    next();
  }
}
