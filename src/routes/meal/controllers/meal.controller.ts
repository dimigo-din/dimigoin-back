import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Request } from "express";

import { DIMIJwtAuthGuard, StudentGuard } from "src/auth/guards";
import { createOpertation } from "src/lib/utils";

import {
  StudentDocument,
  MealTimetable,
  MealTimetableDocument,
  Meal,
  MealDocument,
} from "src/schemas";

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
  @ApiResponse({
    status: 200,
    type: [Meal],
  })
  @UseGuards(DIMIJwtAuthGuard)
  @Get()
  async getWeeklyMeals(): Promise<MealDocument[]> {
    return await this.mealService.getWeeklyMeals();
  }

  @ApiOperation(
    createOpertation({
      name: "급식 시간표",
      description: "급식 시간표를 반환합니다.",
      studentOnly: true,
    }),
  )
  @ApiResponse({
    status: 200,
    type: MealTimetable,
  })
  @UseGuards(DIMIJwtAuthGuard, StudentGuard)
  @Get("/timetable")
  async getMealTimetable(@Req() req: Request): Promise<MealTimetableDocument> {
    return await this.mealService.getMealTimetable(req.user as StudentDocument);
  }
}
