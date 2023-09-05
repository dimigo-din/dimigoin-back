import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { Request } from "express";

import { DIMIJwtAuthGuard, StudentGuard } from "src/auth/guards";
import { createOpertation } from "src/common/utils";

import {
  StudentDocument,
  LaundryTimetableDocument,
  LaundryApplicationDocument,
} from "src/schemas";

import { ApplyLaundryDto } from "../dto";
import { LaundryService } from "../providers";

@ApiTags("Laundry")
@Controller("laundry")
export class LaundryController {
  constructor(private readonly laundryService: LaundryService) {}

  @ApiOperation(
    createOpertation({
      name: "세탁기",
      description: "사용가능한 세탁기와 신청정보를 반환합니다.",
    }),
  )
  @Get()
  @UseGuards(DIMIJwtAuthGuard, StudentGuard)
  async getLaundries(@Req() req: Request): Promise<{
    timetables: LaundryTimetableDocument[];
    applications: LaundryApplicationDocument[];
  }> {
    const laundryTimetables = await this.laundryService.getLaundryTimetables(
      req.user as StudentDocument,
    );

    const laundryApplications =
      await this.laundryService.getLaundryApplications(
        req.user as StudentDocument,
      );

    return {
      timetables: laundryTimetables,
      applications: laundryApplications,
    };
  }

  @ApiOperation(
    createOpertation({
      name: "세탁 신청",
      description: "세탁을 신청합니다.",
    }),
  )
  @Post()
  @UseGuards(DIMIJwtAuthGuard, StudentGuard)
  async applyLaundry(
    @Req() req: Request,
    @Body() data: ApplyLaundryDto,
  ): Promise<LaundryApplicationDocument> {
    const laundryApplication = await this.laundryService.applyLaundry(
      req.user as StudentDocument,
      data,
    );

    return laundryApplication;
  }

  @ApiOperation(
    createOpertation({
      name: "세탁 신청 취소",
      description: "세탁신청을 취소합니다.",
    }),
  )
  @Delete()
  @UseGuards(DIMIJwtAuthGuard, StudentGuard)
  async cancelLaundry(
    @Req() req: Request,
  ): Promise<LaundryApplicationDocument> {
    const laundryApplication = await this.laundryService.cancelLaundry(
      req.user as StudentDocument,
    );

    return laundryApplication;
  }
}
