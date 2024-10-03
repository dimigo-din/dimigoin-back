import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import moment from "moment";
import { Model } from "mongoose";

import { GradeValues, ClassValues } from "src/lib/types";
import { momentToStringDate } from "src/lib/utils";

import { TimetableDocument, Timetable } from "src/schemas";

@Injectable()
export class TimetableService {
  constructor(
    @InjectModel(Timetable.name)
    private timetableModel: Model<TimetableDocument>,
  ) {}

  async getWeeklyTimetable(
    _grade: keyof typeof GradeValues,
    _class: keyof typeof ClassValues,
  ): Promise<TimetableDocument[]> {
    const startOfWeek = momentToStringDate(moment().startOf("week"));
    const endOfWeek = momentToStringDate(moment().endOf("week"));

    return await this.timetableModel.find({
      grade: _grade,
      class: _class,
      date: {
        $gte: startOfWeek,
        $lte: endOfWeek,
      },
    });
  }
}
