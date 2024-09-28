import { HttpService } from "@nestjs/axios";
import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import moment from "moment";
import { Model } from "mongoose";

import { momentToStringDate } from "src/lib/utils";

import {
  Meal,
  MealDocument,
  MealTimetable,
  MealTimetableDocument,
  StudentDocument,
} from "src/schemas";

@Injectable()
export class MealService {
  constructor(
    @InjectModel(Meal.name)
    private mealModel: Model<MealDocument>,

    @InjectModel(MealTimetable.name)
    private mealTimetableModel: Model<MealTimetableDocument>,

    private readonly httpService: HttpService,
  ) {}

  async getMeals(): Promise<MealDocument[]> {
    const meals = await this.mealModel.find({
      date: {
        $gte: momentToStringDate(moment().startOf("week")),
        $lte: momentToStringDate(moment().endOf("week")),
      },
    });

    return meals;
  }

  async getMealTimetable(
    user: StudentDocument,
  ): Promise<MealTimetableDocument> {
    const timetable = await this.mealTimetableModel.findOne({
      grade: user.grade,
    });
    if (!timetable)
      throw new HttpException("급식시간표가 아직 추가되지 않았습니다.", 404);

    return timetable;
  }
}
