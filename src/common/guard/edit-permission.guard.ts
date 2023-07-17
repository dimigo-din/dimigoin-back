import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from 'src/api/user/user.service';
import { TeacherDocument } from '../schemas';

@Injectable()
export class EditPermissionGuard implements CanActivate {
  constructor(@Inject(UserService) private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext) {
    const req: Request = context.switchToHttp().getRequest();
    const user = req.user;

    const service = req.path.split('/')[1];
    const permission = await this.userService.getPermissionByGroup(user.groups);
    user.permissions.edit.push(...permission.edit);

    if (user.hasOwnProperty('positions')) {
      const teacher = user as TeacherDocument;
      const positionPerm = await this.userService.getPermissionByPosition(
        teacher.positions,
      );
      user.permissions.edit.push(...positionPerm.edit);
    }

    if (
      !user.permissions.edit.includes(service) &&
      !user.permissions.edit.includes('*')
    )
      return false;
    return true;
  }
}
