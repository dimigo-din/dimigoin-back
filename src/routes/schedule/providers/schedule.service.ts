import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import moment = require("moment");
import { Model } from "mongoose";

import { momentToStringDateTime } from "src/common/utils";

import { Schedule, ScheduleDocument } from "src/schemas";

@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel(Schedule.name)
    private scheduleModel: Model<ScheduleDocument>,
  ) {}

  async getSchedules(year: number, month: number): Promise<Schedule[]> {
    const start = momentToStringDateTime(moment([year, month - 1]));
    const end = momentToStringDateTime(moment(start).endOf("month"));

    return await this.scheduleModel
      .find({
        date: {
          $gte: start,
          $lte: end,
        },
      })
      .sort({
        date: 1,
        type: 1,
      });
  }
}
