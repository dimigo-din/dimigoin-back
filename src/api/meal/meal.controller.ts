import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { StudentDocument } from 'src/common/schemas';
import { MealService } from './meal.service';
import moment from 'moment';
import {
  EditPermissionGuard,
  StudentOnlyGuard,
  ViewPermissionGuard,
} from 'src/common/guard';
import { MealTimetable } from 'src/common/schemas/meal-timetable.schema';
import { CreateMealTimetableDto } from 'src/common/dto';

@Controller('meal')
export class MealController {
  constructor(private readonly mealService: MealService) {}

  @Get()
  async getTodayMeal(): Promise<any> {
    return this.mealService.getMeal(moment().format('YYYY-MM-DD'));
  }

  @Get('/week')
  async getWeeklyMeal(): Promise<any> {
    return this.mealService.getWeeklyMeal();
  }

  @UseGuards(ViewPermissionGuard)
  @Get('/timetable/all')
  async getAllTimetable(): Promise<MealTimetable[]> {
    return this.mealService.getAllTimetable();
  }

  @UseGuards(StudentOnlyGuard)
  @Get('/timetable/times')
  async getMealTimetable(@Req() req: Request): Promise<MealTimetable> {
    return this.mealService.getMealTimetable(req.user as StudentDocument);
  }

  @UseGuards(EditPermissionGuard)
  @Post('/timetable/create')
  async createMealTimetable(
    @Body() data: CreateMealTimetableDto,
  ): Promise<MealTimetable> {
    return this.mealService.createMealTimetable(data);
  }

  @Get('/:date')
  async getMeal(@Param('date') date: string): Promise<any> {
    return this.mealService.getMeal(date);
  }
}
