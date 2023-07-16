import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { Meal } from 'src/common/schemas';
import { MealService } from './meal.service';
import moment from 'moment';

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

  @Get('/:date')
  async getMeal(@Param('date') date: string): Promise<any> {
    return this.mealService.getMeal(date);
  }
}
