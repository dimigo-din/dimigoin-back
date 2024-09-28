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

  async getTimetable(
    _grade: keyof typeof GradeValues,
    _class: keyof typeof ClassValues,
  ): Promise<TimetableDocument[]> {
    const weekStart = momentToStringDate(moment().startOf("week"));
    const weekEnd = momentToStringDate(moment().endOf("week"));

    const timetable = await this.timetableModel.find({
      grade: _grade,
      class: _class,
      date: {
        $gte: weekStart,
        $lte: weekEnd,
      },
    });
    return timetable;
  }
}
