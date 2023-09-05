import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Cron, CronExpression } from "@nestjs/schedule";
import moment from "moment";
import { Model } from "mongoose";

import { GradeValues, ClassValues } from "src/common/types";
import { momentToStringDate } from "src/common/utils";

import { Timetable, TimetableDocument } from "src/schemas";

import aliases from "../aliases.json";

@Injectable()
export class TimetableManageService {
  constructor(
    @InjectModel(Timetable.name)
    private timetableModel: Model<TimetableDocument>,

    private readonly httpService: HttpService,
  ) {}

  @Cron(CronExpression.EVERY_6_HOURS)
  async updateTimetable(): Promise<Timetable[]> {
    const weekStart = momentToStringDate(moment().startOf("week"));
    const weekEnd = momentToStringDate(moment().endOf("week"));

    const list = [];
    for (
      let date = weekStart;
      date < weekEnd;
      date = momentToStringDate(moment(date).add(1, "days"))
    ) {
      for (const _grade of GradeValues) {
        for (const _class of ClassValues) {
          const response = await this.httpService.axiosRef.get(
            "https://open.neis.go.kr/hub/hisTimetable?" +
              `KEY=${process.env.NEIS_KEY}&` +
              "Type=json&" +
              "pSize=1000&" +
              "pIndex=1&" +
              "ATPT_OFCDC_SC_CODE=J10&" +
              "SD_SCHUL_CODE=7530560&" +
              `GRADE=${_grade}&` +
              `CLASS_NM=${_class}&` +
              `TI_FROM_YMD=${date.split("-").join("")}&` +
              `TI_TO_YMD=${date.split("-").join("")}`,
          );

          const { data } = response;
          if ("hisTimetable" in data) {
            const { hisTimetable } = data;
            const { row: result } = hisTimetable[1];

            const dailyTimetable = {
              date,
              grade: _grade,
              class: _class,
              sequence: result
                .sort((a: any, b: any) => a.PERIO - b.PERIO)
                .map((r: any) => {
                  const subject = r.ITRT_CNTNT.replace(/\[보강\]\*/i, "");
                  if (subject in aliases) return aliases[subject];
                  return subject;
                }),
            };

            list.push(dailyTimetable);
          }
        }
      }
    }

    await this.timetableModel.deleteMany({
      date: {
        $gte: weekStart,
        $lte: weekEnd,
      },
    });

    await this.timetableModel.insertMany(list);
    return list;
  }
}
