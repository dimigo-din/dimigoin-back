import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from "@nestjs/common";
import { Request } from "express";

import { UserManageService } from "src/routes/user/providers";

import { TeacherDocument } from "src/schemas";

@Injectable()
export class ViewPermissionGuard implements CanActivate {
  constructor(private readonly userManageService: UserManageService) {}

  async canActivate(context: ExecutionContext) {
    const req: Request = context.switchToHttp().getRequest();
    const user = req.user;

    const service = req.path.split("/")[1];
    const permission = await this.userManageService.getPermissionByGroup(
      user.groups,
    );
    user.permissions.view.push(...permission.view);

    if (user.hasOwnProperty("positions")) {
      const teacher = user as TeacherDocument;
      const positionPerm = await this.userManageService.getPermissionByPosition(
        teacher.positions,
      );
      user.permissions.view.push(...positionPerm.view);
    }

    if (
      !user.permissions.view.includes(service) &&
      !user.permissions.view.includes("*")
    )
      return false;
    return true;
  }
}
