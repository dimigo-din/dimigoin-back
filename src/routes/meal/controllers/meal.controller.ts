import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Request } from "express";
import { StudentDocument } from "src/schemas";
import { MealService } from "../providers/meal.service";
import moment from "moment";
import {
  EditPermissionGuard,
  StudentOnlyGuard,
  ViewPermissionGuard,
} from "src/auth/guards";
import { MealTimetable } from "src/schemas";
import { CreateMealTimetableDto } from "../dto/meal.dto";

import { AuthGuard } from "@nestjs/passport";

@Controller("meal")
export class MealController {
  constructor(private readonly mealService: MealService) {}

  @Get()
  async getTodayMeal(): Promise<any> {
    return await this.mealService.getMeal(moment().format("YYYY-MM-DD"));
  }

  @UseGuards(EditPermissionGuard)
  @Get("/update")
  async updateMeal(): Promise<any> {
    return await this.mealService.updateMeal();
  }

  @Get("/week")
  async getWeeklyMeal(): Promise<any> {
    return await this.mealService.getWeeklyMeal();
  }

  @UseGuards(ViewPermissionGuard)
  @Get("/timetable/all")
  async getAllTimetable(): Promise<MealTimetable[]> {
    return await this.mealService.getAllTimetable();
  }

  @UseGuards(StudentOnlyGuard)
  @Get("/timetable")
  async getMealTimetable(@Req() req: Request): Promise<MealTimetable> {
    return await this.mealService.getMealTimetable(req.user as StudentDocument);
  }

  @UseGuards(EditPermissionGuard)
  @Post("/timetable")
  async createMealTimetable(
    @Body() data: CreateMealTimetableDto,
  ): Promise<MealTimetable> {
    return await this.mealService.createMealTimetable(data);
  }

  @Get("/:date")
  async getMeal(@Param("date") date: string): Promise<any> {
    return await this.mealService.getMeal(date);
  }
}
