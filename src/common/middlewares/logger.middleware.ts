import { Injectable, NestMiddleware, Logger } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class DIMILoggerMiddleware implements NestMiddleware {
  private logger = new Logger(DIMILoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const startTimestamp = Date.now();
    const requestMethod = req.method;
    const originURL = req.originalUrl;
    const httpVersion = `HTTP/${req.httpVersion}`;
    const userAgent = req.headers["user-agent"];
    const ipAddress =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    let authorization = "";
    if (
      req.headers["authorization"] &&
      req.headers["authorization"].startsWith("Bearer")
    ) {
      const authorizationTmp = req.headers["authorization"].replace(
        "Bearer ",
        "",
      );
      if (authorizationTmp.split(".").length === 3) {
        try {
          authorization = `${this.parseJwt(authorizationTmp)._id}(${
            this.parseJwt(authorizationTmp).name
          })`;
        } catch (e) {
          authorization = "unknown";
        }
      }
    } else {
      authorization = "unknown";
    }

    if (!ipAddress) return next();

    res.on("finish", () => {
      const statusCode = res.statusCode;
      const endTimestamp = Date.now() - startTimestamp;

      this.logger.log(
        `${ipAddress} (${userAgent}) - "${requestMethod} ${originURL} ${httpVersion}" ${statusCode} by ${authorization} +${endTimestamp}ms `,
      );

      if (Object.keys(req.body).length > 0)
        this.logger.log(`Request Body: ${JSON.stringify(req.body)}`);
    });
    next();
  }

  parseJwt(token: string) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(""),
    );

    return JSON.parse(jsonPayload);
  }
}
