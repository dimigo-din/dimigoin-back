import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
} from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class StudentGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (user.type !== "student") {
      throw new HttpException("학생만 접근가능한 라우터입니다.", 404);
    }

    return true;
  }
}
