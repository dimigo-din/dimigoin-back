import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { Types } from "mongoose";

import { UserManageService } from "src/routes/user/providers";

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly userManageService: UserManageService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const user = req.user;

    const paths = req.path
      .split("/")
      .filter((v) => v)
      .map((v) => {
        if (Types.ObjectId.isValid(v)) return "_";
        return v;
      });

    const permissions = user.permissions;
    for (const groupId of user.groups) {
      permissions.push(
        ...(await this.userManageService.getGroupPermissions(groupId)),
      );
    }

    for (const permission of permissions) {
      const [permissionMethod, permissionPath] = permission.split(":");
      const permissionPaths = permissionPath.split("/");

      if (
        !(
          req.method.toLowerCase() === permissionMethod ||
          permissionMethod === "@"
        )
      )
        continue;

      for (const [index, value] of Object.entries(permissionPaths)) {
        if (!paths[index]) continue;
        if (value === "*") return true;
        if (value !== paths[index]) continue;
      }

      if (paths.join(" ") === permissionPaths.join(" ")) return true;
    }

    return false;
  }
}
