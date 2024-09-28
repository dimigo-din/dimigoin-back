import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Cron, CronExpression } from "@nestjs/schedule";
import moment from "moment";
import { Model } from "mongoose";
import ical from "node-ical";

import { momentToStringDateTime } from "src/lib/utils";

import { Schedule, ScheduleDocument } from "src/schemas";

import urls from "../resources/urls.json";

@Injectable()
export class ScheduleManageService {
  constructor(
    @InjectModel(Schedule.name)
    private scheduleModel: Model<ScheduleDocument>,

    private readonly httpService: HttpService,
  ) {}

  async getSchedules(): Promise<Schedule[]> {
    return await this.scheduleModel.find();
  }

  async getSchedule(url: string): Promise<
    {
      uid: string;
      name: string;
      start: Date & {
        dateOnly: boolean;
      };
      end: Date & {
        dateOnly: boolean;
      };
    }[]
  > {
    const { data: response } = await this.httpService.axiosRef.get(url);

    const list = [];
    const events = ical.sync.parseICS(response);
    for (const [, event] of Object.entries(events)) {
      if (event.type !== "VEVENT") continue;
      list.push({
        uid: event.uid,
        name: event.summary,
        start: event.start,
        end: event.end,
      });
    }

    return list;
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updateSchedules(): Promise<Schedule[]> {
    const list = [];

    await this.scheduleModel.deleteMany({});
    for (const [key, url] of Object.entries(urls)) {
      const events = await this.getSchedule(url);

      for (const event of events) {
        if (event.start.dateOnly) {
          const start = momentToStringDateTime(moment(event.start));
          const end = momentToStringDateTime(moment(event.end));

          for (
            let date = start;
            date < end;
            date = momentToStringDateTime(moment(date).add(1, "days"))
          ) {
            const schedule = new this.scheduleModel({
              uid: event.uid,
              type: key,
              date: date,
              name: event.name,
            });

            await schedule.save();
            list.push(schedule);
          }
        } else {
          const schedule = new this.scheduleModel({
            uid: event.uid,
            type: key,
            date: momentToStringDateTime(moment(event.start)),
            name: event.name,
          });

          await schedule.save();
          list.push(schedule);
        }
      }
    }

    return list;
  }
}
