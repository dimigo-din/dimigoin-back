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
import { ApiTags, ApiOperation, ApiParam } from "@nestjs/swagger";
import { Request } from "express";
import { Types } from "mongoose";

import { DIMIJwtAuthGuard, StudentGuard } from "src/auth/guards";
import { createOpertation } from "src/lib/utils";

import { ObjectIdPipe } from "src/lib";

import { StudentDocument, LaundryTimetableDocument } from "src/schemas";

import { ApplyLaundryDto } from "../dto";
import { LaundryService } from "../providers";

@ApiTags("Laundry")
@Controller("laundry")
export class LaundryController {
  constructor(private readonly laundryService: LaundryService) {}

  @ApiOperation(
    createOpertation({
      name: "세탁기 및 건조기 시간표 가져오기",
      description:
        "현재 사용 가능한 세탁기와 건조기의 시간표 (신청 정보 포함) 을 반환합니다.",
      studentOnly: true,
    }),
  )
  @Get()
  @UseGuards(DIMIJwtAuthGuard, StudentGuard)
  async getLaundries(@Req() req: Request): Promise<LaundryTimetableDocument[]> {
    return await this.laundryService.getAllLaundryTimetable(
      req.user as StudentDocument,
    );
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
  async applyLaundry(@Req() req: Request, @Body() body: ApplyLaundryDto) {
    return await this.laundryService.applyLaundry(
      req.user as StudentDocument,
      body,
    );
  }

  @ApiOperation(
    createOpertation({
      name: "세탁기 및 건조기 신청 취소",
      description:
        "세탁기 혹은 건조기 신청을 취소합니다. 취소하려는 신청 Application의 ObjectId (sequence.$[]._id) 를 필요로 합니다.",
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
    @Param("laundryApplicationId", ObjectIdPipe)
    laundryApplicationId: Types.ObjectId,
  ) {
    return await this.laundryService.cancelLaundry(
      req.user as StudentDocument,
      laundryApplicationId,
    );
  }
}
