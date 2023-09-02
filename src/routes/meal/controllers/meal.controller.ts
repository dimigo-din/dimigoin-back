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
import moment from "moment";

import {
  DIMIJwtAuthGuard,
  EditPermissionGuard,
  StudentOnlyGuard,
  ViewPermissionGuard,
} from "src/auth/guards";

import { StudentDocument, MealTimetable } from "src/schemas";

import { CreateMealTimetableDto } from "../dto";
import { MealService } from "../providers";

@Controller("meal")
export class MealController {
  constructor(private readonly mealService: MealService) {}

  @UseGuards(DIMIJwtAuthGuard)
  @Get()
  async getTodayMeal(): Promise<any> {
    return await this.mealService.getMeal(moment().format("YYYY-MM-DD"));
  }

  @UseGuards(DIMIJwtAuthGuard, EditPermissionGuard)
  @Get("/update")
  async updateMeal(): Promise<any> {
    return await this.mealService.updateMeal();
  }

  @UseGuards(DIMIJwtAuthGuard)
  @Get("/week")
  async getWeeklyMeal(): Promise<any> {
    return await this.mealService.getWeeklyMeal();
  }

  @UseGuards(DIMIJwtAuthGuard, ViewPermissionGuard)
  @Get("/timetable/all")
  async getAllTimetable(): Promise<MealTimetable[]> {
    return await this.mealService.getAllTimetable();
  }

  @UseGuards(DIMIJwtAuthGuard, StudentOnlyGuard)
  @Get("/timetable")
  async getMealTimetable(@Req() req: Request): Promise<MealTimetable> {
    return await this.mealService.getMealTimetable(req.user as StudentDocument);
  }

  @UseGuards(DIMIJwtAuthGuard, EditPermissionGuard)
  @Post("/timetable")
  async createMealTimetable(
    @Body() data: CreateMealTimetableDto,
  ): Promise<MealTimetable> {
    return await this.mealService.createMealTimetable(data);
  }

  @UseGuards(DIMIJwtAuthGuard)
  @Get("/:date")
  async getMeal(@Param("date") date: string): Promise<any> {
    return await this.mealService.getMeal(date);
  }
}
