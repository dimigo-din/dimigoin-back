import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";

import { DIMIJwtAuthGuard } from "src/auth/guards";
import { createOpertation } from "src/common/utils";

import { Schedule } from "src/schemas";

import { ScheduleService } from "../providers";

@ApiTags("Schedule")
@Controller("schedule")
export class ScheduleController {
  constructor(private readonly mealService: ScheduleService) {}

  @ApiOperation(
    createOpertation({
      name: "학사일정",
      description: "모든 학사일정을 가져옵니다.",
    }),
  )
  @UseGuards(DIMIJwtAuthGuard)
  @Get("/:year/:month")
  async getSchedules(
    @Param("year") year: number,
    @Param("month") month: number,
  ): Promise<Schedule[]> {
    return await this.mealService.getSchedules(year, month);
  }
}
