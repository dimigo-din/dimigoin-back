import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Request } from "express";

import { StudentGuard, DIMIJwtAuthGuard } from "src/auth/guards";
import { createOpertation } from "src/lib/utils";

import {
  StudentDocument,
  StayApplicationDocument,
  StayOutgoDocument,
  FrigoApplicationDocument,
  LaundryApplicationDocument,
} from "src/schemas";

import { GetApplicationResponse } from "../dto";
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
  @ApiResponse({
    status: 200,
    type: GetApplicationResponse,
  })
  @UseGuards(DIMIJwtAuthGuard, StudentGuard)
  @Get()
  async getApplication(@Req() req: Request): Promise<{
    laundry: LaundryApplicationDocument[] | null;
    frigo: FrigoApplicationDocument | null;
    stay: StayApplicationDocument | null;
    stayOutgos: StayOutgoDocument[] | null;
  }> {
    return await this.userService.getApplication(req.user as StudentDocument);
  }
}
