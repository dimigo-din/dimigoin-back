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
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";
import { Request } from "express";

import { DIMIJwtAuthGuard, StudentGuard } from "src/auth/guards";
import { createOpertation } from "src/lib/utils";

import { StudentDocument, LaundryTimetableDocument } from "src/schemas";

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
    return await this.laundryService.applyLaundry(
      req.user as StudentDocument,
      data,
    );
  }

  @ApiOperation(
    createOpertation({
      name: "세탁기 및 건조기 신청 취소",
      description:
        "세탁기 혹은 건조기 신청을 취소합니다. 취소하려는 신청 Application의 ObjectId를 필요로 합니다.",
      studentOnly: true,
    }),
  )
  @ApiParam({
    required: true,
    name: "laundryApplicationId",
    description:
      "세탁 혹은 건조 신청 Application (LaundryApplication) 의 ObjectId",
    type: String,
  })
  @Delete("/:laundryApplicationId")
  @UseGuards(DIMIJwtAuthGuard, StudentGuard)
  async cancelLaundry(
    @Req() req: Request,
    @Param("laundryApplicationId") laundryApplicationId: string,
  ): Promise<LaundryApplicationDocument> {
    return await this.laundryService.cancelLaundry(
      req.user as StudentDocument,
      laundryApplicationId,
    );
  }
}
