import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";

import { DIMIJwtAuthGuard, EditPermissionGuard } from "src/auth/guards";
import { createOpertation } from "src/common/utils";

import { Timetable } from "src/schemas";

import { TimetableManageService } from "../providers";

@ApiTags("Timetable Manage")
@Controller("manage/timetable")
export class TimetableManageController {
  constructor(
    private readonly timetableManageService: TimetableManageService,
  ) {}

  @ApiOperation(
    createOpertation({
      name: "시간표 업데이트",
      description: "시간표를 업데이트합니다.",
    }),
  )
  @UseGuards(DIMIJwtAuthGuard, EditPermissionGuard)
  @Get()
  async updateTimetable(): Promise<Timetable[]> {
    return await this.timetableManageService.updateTimetable();
  }
}
