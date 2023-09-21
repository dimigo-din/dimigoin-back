import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, catchError, throwError } from "rxjs";

import target from "src/../target.json";
import { globalOpcode } from "src/common/opcode";

@Injectable()
export class DIMIWrapperInterceptor implements NestInterceptor {
  private readonly logger = new Logger(DIMIWrapperInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    context
      .switchToHttp()
      .getResponse()
      .status(200)
      .header("Target-Version", target.version);

    const errorPipe = catchError((err) => {
      if (err.name !== "HttpException") {
        this.logger.error(err.name, err);
        return throwError(() => globalOpcode.InvalidError());
      }

      return throwError(() => err);
    });

    return next.handle().pipe(errorPipe);
  }
}
