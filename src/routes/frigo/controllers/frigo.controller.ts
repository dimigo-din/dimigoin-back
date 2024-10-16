import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { Request } from "express";

import { DIMIJwtAuthGuard, StudentGuard } from "src/auth/guards";
import { createOpertation } from "src/lib/utils";

import {
  FrigoApplicationDocument,
  FrigoDocument,
  StudentDocument,
} from "src/schemas";

import { ApplyFrigoRequestDto } from "../dto";
import { FrigoManageService, FrigoService } from "../providers";

@ApiTags("Frigo")
@Controller("frigo")
export class FrigoController {
  constructor(
    private readonly frigoService: FrigoService,
    private readonly frigoManageService: FrigoManageService,
  ) {}

  @ApiOperation(
    createOpertation({
      name: "현재 금요귀가 정보",
      description: "현재 활성화되어있는 금요귀가 정보를 반환합니다.",
    }),
  )
  @UseGuards(DIMIJwtAuthGuard, StudentGuard)
  @Get()
  async getCurrentFrigo(): Promise<FrigoDocument> {
    return await this.frigoManageService.getCurrentFrigo();
  }

  @ApiOperation(
    createOpertation({
      name: "금요귀가 신청",
      description: "학생이 금요귀가를 신청합니다.",
      studentOnly: true,
    }),
  )
  @UseGuards(DIMIJwtAuthGuard, StudentGuard)
  @Post()
  async applyFrigo(
    @Req() req: Request,
    @Body() body: ApplyFrigoRequestDto,
  ): Promise<FrigoApplicationDocument> {
    return await this.frigoService.applyFrigo(
      req.user as StudentDocument,
      body,
    );
  }

  @ApiOperation(
    createOpertation({
      name: "금요귀가 신청 취소",
      description: "학생이 금요귀가 신청을 취소합니다.",
      studentOnly: true,
    }),
  )
  @UseGuards(DIMIJwtAuthGuard, StudentGuard)
  @Delete()
  async cancelFrigo(@Req() req: Request): Promise<FrigoApplicationDocument> {
    return await this.frigoService.cancelFrigo(req.user as StudentDocument);
  }
}
