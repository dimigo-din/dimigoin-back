import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { Meal } from 'src/common/schemas';
import { MealService } from './meal.service';

@Controller('meal')
export class MealController {
  constructor(private readonly mealService: MealService) {}

  @Get()
  async getTodayMeal(): Promise<any> {
    return this.mealService.getTodayMeal();
  }

  @Get('/week')
  async getWeekMeal(): Promise<any> {
    return this.mealService.getWeekMeal();
  }

  @Get('/:date')
  async getMeal(@Param('date') date: string): Promise<any> {
    return this.mealService.getMeal(date);
  }
}
