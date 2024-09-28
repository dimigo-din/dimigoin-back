import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Req,
  Param,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Request } from "express";

import { DIMIJwtAuthGuard, StudentGuard } from "src/auth/guards";
import { createOpertation } from "src/lib/utils";

import {
  StudentDocument,
  LaundryTimetableDocument,
  LaundryApplicationDocument,
} from "src/schemas";

import { GetLaundriesResponse, ApplyLaundryDto } from "../dto";
import { LaundryService } from "../providers";

@ApiTags("Laundry")
@Controller("laundry")
export class LaundryController {
  constructor(private readonly laundryService: LaundryService) {}

  @ApiOperation(
    createOpertation({
      name: "세탁기 및 건조기 가져오기",
      description: "현재 사용 가능한 세탁기와 건조기의 신청 정보를 반환합니다.",
      studentOnly: true,
    }),
  )
  @ApiResponse({
    status: 200,
    type: GetLaundriesResponse,
  })
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
      name: "세탁기 및 건조기 신청",
      description: "세탁기 및 건조기를 신청합니다.",
      studentOnly: true,
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
      name: "세탁기 및 건조기 신청 취소",
      description: "세탁기 혹은 건조기 신청을 취소합니다.",
      studentOnly: true,
    }),
  )
  @Delete("/:laundryId")
  @UseGuards(DIMIJwtAuthGuard, StudentGuard)
  async cancelLaundry(
    @Req() req: Request,
    @Param("laundryId") laundryId: string,
  ): Promise<LaundryApplicationDocument> {
    const allLaundryApplication = await this.laundryService.cancelLaundry(
      req.user as StudentDocument,
    );
  }
}
