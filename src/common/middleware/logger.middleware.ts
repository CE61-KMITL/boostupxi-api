import { Injectable, NestMiddleware ,Logger} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as fsPromises from 'fs/promises';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger("HTTP");

  async use(request: Request, response: Response, next: NextFunction): Promise<void> {
    const { ip, method, originalUrl } = request;
    const userAgent = request.get("user-agent") || "";
    const dateTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

    response.on("finish", () => {
      const { statusCode } = response;
      const contentLength = response.get("content-length");
      const logMessage = `${dateTime}\t${uuidv4()}\t${method}\t${originalUrl}\t${statusCode}\t${contentLength}\t${userAgent}\t${ip}\n`;
      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
      );
      try {
            if (!fs.existsSync(path.join(__dirname, `../../../logs`))) {
               fsPromises.mkdir(path.join(__dirname, `../../../logs`));
            }
      
             fsPromises.appendFile(
              path.join(__dirname, `../../../logs/reqLog.log`),
              logMessage,
            );
          } catch (error) {
            console.log(error);
          }
    });

    next();
  }
}
