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

import { ApplyFrigoDto } from "../dto";
import { FrigoService } from "../providers";

@ApiTags("Frigo")
@Controller("frigo")
export class FrigoController {
  constructor(private readonly frigoService: FrigoService) {}

  @ApiOperation(
    createOpertation({
      name: "현재 금요귀가 정보",
      description: "금요귀가 정보를 반환합니다.",
    }),
  )
  @UseGuards(DIMIJwtAuthGuard, StudentGuard)
  @Get()
  async getCurrentFrigo(): Promise<FrigoDocument> {
    return await this.frigoService.getCurrentFrigo();
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
    @Body() data: ApplyFrigoDto,
  ): Promise<FrigoApplicationDocument> {
    return await this.frigoService.applyFrigo(
      req.user as StudentDocument,
      data,
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
