import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import importToArray from "import-to-array";

import {
  Meal,
  MealSchema,
  MealTimetable,
  MealTimetableSchema,
} from "src/schemas";

import * as mealControllers from "./controllers";
import * as mealServices from "./providers";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Meal.name, schema: MealSchema }]),
    MongooseModule.forFeature([
      { name: MealTimetable.name, schema: MealTimetableSchema },
    ]),
    HttpModule,
  ],
  controllers: importToArray(mealControllers),
  providers: importToArray(mealServices),
  exports: importToArray(mealServices),
})
export class MealModule {}
