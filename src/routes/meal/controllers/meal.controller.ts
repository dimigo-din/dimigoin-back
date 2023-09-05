import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { Request } from "express";

import { DIMIJwtAuthGuard, StudentGuard } from "src/auth/guards";
import { createOpertation } from "src/common/utils";

import { StudentDocument, MealTimetable, MealDocument } from "src/schemas";

import { MealService } from "../providers";

@ApiTags("Meal")
@Controller("meal")
export class MealController {
  constructor(private readonly mealService: MealService) {}

  @ApiOperation(
    createOpertation({
      name: "급식",
      description: "일주일치 급식을 반환합니다.",
    }),
  )
  @UseGuards(DIMIJwtAuthGuard)
  @Get()
  async getMeals(): Promise<MealDocument[]> {
    return await this.mealService.getMeals();
  }

  @ApiOperation(
    createOpertation({
      name: "급식 시간표",
      description: "급식 시간표를 반환합니다.",
      studentOnly: true,
    }),
  )
  @UseGuards(DIMIJwtAuthGuard, StudentGuard)
  @Get("/timetable")
  async getMealTimetable(@Req() req: Request): Promise<MealTimetable> {
    return await this.mealService.getMealTimetable(req.user as StudentDocument);
  }
}
