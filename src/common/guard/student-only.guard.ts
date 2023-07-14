import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class StudentOnlyGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user.hasOwnProperty('grade')) {
      throw new HttpException('학생만 접근가능한 라우터입니다.', 404);
    }

    return true;
  }
}
