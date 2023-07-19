import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { Meal, MealSchema } from 'src/common/schemas';
import {
  MealTimetable,
  MealTimetableSchema,
} from 'src/common/schemas/meal-timetable.schema';
import { MealService } from './meal.service';
import { MealController } from './meal.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Meal.name, schema: MealSchema }]),
    MongooseModule.forFeature([{ name: MealTimetable.name, schema: MealTimetableSchema }]),
    HttpModule,
  ],
  controllers: [MealController],
  providers: [MealService],
  exports: [MealService],
})
export class MealModule {}
