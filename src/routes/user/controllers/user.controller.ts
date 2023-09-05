import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { Request } from "express";

import { StudentGuard, DIMIJwtAuthGuard } from "src/auth/guards";
import { createOpertation } from "src/common/utils";

import {
  StudentDocument,
  StayApplicationDocument,
  StayOutgoDocument,
} from "src/schemas";

import { UserService } from "../providers";

@ApiTags("User")
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation(
    createOpertation({
      name: "신청정보",
      description: "자신의 신청정보를 반환합니다.",
      studentOnly: true,
    }),
  )
  @UseGuards(DIMIJwtAuthGuard, StudentGuard)
  @Get()
  async getApplication(@Req() req: Request): Promise<{
    laundry: any;
    frigo: any;
    stay: StayApplicationDocument | null;
    stayOutgo: StayOutgoDocument[] | null;
  }> {
    return await this.userService.getApplication(req.user as StudentDocument);
  }
}
