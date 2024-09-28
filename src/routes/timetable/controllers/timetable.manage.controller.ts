import { Controller, Post, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";

import { DIMIJwtAuthGuard, PermissionGuard } from "src/auth/guards";
import { createOpertation } from "src/lib/utils";

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
  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  @Post()
  async updateTimetable(): Promise<Timetable[]> {
    return await this.timetableManageService.updateTimetable();
  }
}
