import { Injectable, NestMiddleware, Logger } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class DIMILoggerMiddleware implements NestMiddleware {
  private logger = new Logger(DIMILoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const startTimestamp = Date.now();
    const requestMethod = req.method;
    const originURL = req.url || req.originalUrl;
    const httpVersion = `HTTP/${req.httpVersion}`;
    const userAgent = req.headers["user-agent"];
    const ipAddress =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    if (!ipAddress) return next();

    res.on("finish", () => {
      const statusCode = res.statusCode;
      const endTimestamp = Date.now() - startTimestamp;

      this.logger.log(
        `${ipAddress} (${userAgent}) - "${requestMethod} ${originURL} ${httpVersion}" ${statusCode} +${endTimestamp}ms`,
      );

      if (Object.keys(req.body).length > 0)
        this.logger.log(`Request Body: ${JSON.stringify(req.body)}`);
    });
    next();
  }
}
