import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { HttpModule } from "@nestjs/axios";
import {
  Meal,
  MealSchema,
  MealTimetable,
  MealTimetableSchema,
} from "src/schemas";
import { MealService } from "./providers/meal.service";
import { MealController } from "./controllers/meal.controller";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Meal.name, schema: MealSchema }]),
    MongooseModule.forFeature([
      { name: MealTimetable.name, schema: MealTimetableSchema },
    ]),
    HttpModule,
  ],
  controllers: [MealController],
  providers: [MealService],
  exports: [MealService],
})
export class MealModule {}
