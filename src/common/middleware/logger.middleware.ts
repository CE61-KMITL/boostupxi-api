import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as path from 'path';
import * as fsPromises from 'fs/promises';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');
  private readonly logDirectory = path.join(__dirname, '../../../logs');
  private readonly logFile = path.join(this.logDirectory, 'reqLog.log');

  async use(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';
    const dateTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

    response.on('finish', async () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');
      const logMessage = `${dateTime}\t${uuidv4()}\t${method}\t${originalUrl}\t${statusCode}\t${contentLength}\t${userAgent}\t${ip}\n`;
      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
      );
      try {
        await fsPromises.mkdir(this.logDirectory, { recursive: true });
        await fsPromises.appendFile(this.logFile, logMessage);
      } catch (error) {
        console.error('Error while writing log file');
      }
    });

    next();
  }
}
