import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Schedule, ScheduleDocument } from "src/schemas";

@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel(Schedule.name)
    private scheduleModel: Model<ScheduleDocument>,
  ) {}

  async getSchedules(): Promise<Schedule[]> {
    return await this.scheduleModel.find();
  }
}
