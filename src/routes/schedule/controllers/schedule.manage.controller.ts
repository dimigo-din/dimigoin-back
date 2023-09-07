import { Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";

import { DIMIJwtAuthGuard, PermissionGuard } from "src/auth/guards";
import { createOpertation } from "src/common/utils";

import { Schedule } from "src/schemas";

import { ScheduleManageService } from "../providers";

@ApiTags("Schedule Manage")
@Controller("manage/schedule")
export class ScheduleManageController {
  constructor(private readonly mealManageService: ScheduleManageService) {}

  @ApiOperation(
    createOpertation({
      name: "학사일정",
      description: "모든 학사일정을 가져옵니다.",
    }),
  )
  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  @Get()
  async getSchedules(): Promise<Schedule[]> {
    return await this.mealManageService.getSchedules();
  }

  @ApiOperation(
    createOpertation({
      name: "학사일정 업데이트",
      description: "학사일정을 업데이트합니다.",
    }),
  )
  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  @Post()
  async updateSchedules(): Promise<Schedule[]> {
    return await this.mealManageService.updateSchedules();
  }
}
