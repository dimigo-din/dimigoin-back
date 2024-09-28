import { Body, Controller, Get, Post, Put, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";

import { DIMIJwtAuthGuard, PermissionGuard } from "src/auth/guards";
import { createOpertation } from "src/lib/utils";

import { Meal, MealTimetableDocument, MealTimetable } from "src/schemas";

import { CreateMealTimetableDto } from "../dto";
import { MealManageService } from "../providers";

@ApiTags("Meal Manage")
@Controller("manage/meal")
export class MealManageController {
  constructor(private readonly mealManageService: MealManageService) {}

  @ApiOperation(
    createOpertation({
      name: "급식 업데이트",
      description: "급식을 업데이트합니다.",
    }),
  )
  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  @Post()
  async updateMeals(): Promise<Meal[]> {
    return await this.mealManageService.updateMeals();
  }

  @ApiOperation(
    createOpertation({
      name: "모든 급식 시간표",
      description: "모든 급식 시간표를 반환합니다.",
    }),
  )
  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  @Get("/timetable")
  async getMealTimetables(): Promise<MealTimetableDocument[]> {
    return await this.mealManageService.getMealTimetables();
  }

  @ApiOperation(
    createOpertation({
      name: "급식 시간표 업데이트",
      description: "급식 시간표를 업데이트합니다.",
    }),
  )
  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  @Put("/timetable")
  async createMealTimetable(
    @Body() data: CreateMealTimetableDto,
  ): Promise<MealTimetable> {
    return await this.mealManageService.createMealTimetable(data);
  }
}
