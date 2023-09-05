import { Injectable, ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class DIMIJwtAuthGuard extends AuthGuard("jwt") {
  canActivate(context: ExecutionContext): any {
    return super.canActivate(context);
  }
}
