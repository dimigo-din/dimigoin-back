import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { Request } from "express";
import { Types } from "mongoose";

import { StudentOnlyGuard, DIMIJwtAuthGuard } from "src/auth/guards";
import { createOpertation } from "src/common/utils";

import { Stay, StayApplication, StayOutgo, StudentDocument } from "src/schemas";

import { ApplyStayDto, ApplyStayOutgoDto } from "../dto";
import { StayService } from "../providers";

@ApiTags("Stay")
@Controller("stay")
export class StayController {
  constructor(private readonly stayService: StayService) {}

  @ApiOperation(
    createOpertation({
      name: "현재 잔류 정보",
      description:
        "현재 활성화 되어있는 잔류 정보와 잔류 신청자 목록을 반환합니다.",
    }),
  )
  @UseGuards(DIMIJwtAuthGuard)
  @Get()
  async getCurrentStay(): Promise<{
    stay: Stay;
    applications: StayApplication[];
  }> {
    const currentStay = await this.stayService.getCurrentStay();
    const currentApplications =
      await this.stayService.getCurrentStayApplications();
    return {
      stay: currentStay,
      applications: currentApplications,
    };
  }

  @ApiOperation(
    createOpertation({
      name: "잔류 신청",
      description: "학생이 잔류를 신청합니다.",
      only: "student",
    }),
  )
  @UseGuards(DIMIJwtAuthGuard, StudentOnlyGuard)
  @Post()
  async applyStay(
    @Req() req: Request,
    @Body() data: ApplyStayDto,
  ): Promise<StayApplication> {
    return await this.stayService.applyStay(req.user as StudentDocument, data);
  }

  @ApiOperation(
    createOpertation({
      name: "잔류 신청 취소",
      description: "학생이 잔류 신청을 취소합니다.",
      only: "student",
    }),
  )
  @UseGuards(DIMIJwtAuthGuard, StudentOnlyGuard)
  @Delete()
  async cancelStay(@Req() req: Request): Promise<StayApplication> {
    return await this.stayService.cancelStay(req.user as StudentDocument);
  }

  @ApiOperation(
    createOpertation({
      name: "잔류외출 신청",
      description: "학생이 잔류외출을 신청합니다.",
      only: "student",
    }),
  )
  @UseGuards(DIMIJwtAuthGuard, StudentOnlyGuard)
  @Post("outgo")
  async applyStayOutgo(
    @Req() req: Request,
    @Body() data: ApplyStayOutgoDto,
  ): Promise<StayOutgo> {
    return await this.stayService.applyStayOutgo(
      req.user as StudentDocument,
      data,
    );
  }

  @ApiOperation(
    createOpertation({
      name: "잔류외출 신청 취소",
      description: "학생이 잔류외출 신청을 취소합니다.",
      only: "student",
    }),
  )
  @UseGuards(DIMIJwtAuthGuard, StudentOnlyGuard)
  @Delete("outgo/:id")
  async cancelStayOutgo(
    @Req() req: Request,
    @Param("id") outgoId: Types.ObjectId,
  ): Promise<StayOutgo> {
    return await this.stayService.cancelStayOutgo(
      req.user as StudentDocument,
      outgoId,
    );
  }
}
