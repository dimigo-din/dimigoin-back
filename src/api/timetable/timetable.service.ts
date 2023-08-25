import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { Timetable, TimetableDocument } from 'src/common/schemas';
import { HttpService } from '@nestjs/axios';
import aliases from './aliases.json';
import moment from 'moment';

@Injectable()
export class TimetableService {
  constructor(
    @InjectModel(Timetable.name)
    private timetableModel: Model<TimetableDocument>,
    private readonly httpService: HttpService,
  ) {}

  async getTimetable(_grade: number, _class: number): Promise<any> {
    const weekStart = moment().startOf('week');
    const weekEnd = moment().endOf('week');

    const timetable = await this.timetableModel.find({
      grade: _grade,
      class: _class,
      date: {
        $gte: weekStart.toDate(),
        $lte: weekEnd.toDate(),
      },
    });
    return timetable.map((t) => ({
      date: moment(t.date).format('YYYY-MM-DD'),
      sequence: t.sequence,
    }));
  }

  @Cron(CronExpression.EVERY_6_HOURS)
  async updateTimetable(): Promise<any> {
    const weekStart = moment().startOf('week').format('YYYY-MM-DD');
    const weekEnd = moment().endOf('week').format('YYYY-MM-DD');

    const timetable = [];
    for (
      let date = weekStart;
      date < weekEnd;
      date = moment(date).add(1, 'days').format('YYYY-MM-DD')
    ) {
      for (let _grade = 1; _grade <= 3; _grade += 1) {
        for (let _class = 1; _class <= 6; _class += 1) {
          const response = await this.httpService.axiosRef.get(
            'https://open.neis.go.kr/hub/hisTimetable?' +
              `KEY=${process.env.NEIS_KEY}&` +
              'Type=json&' +
              'pSize=1000&' +
              'pIndex=1&' +
              'ATPT_OFCDC_SC_CODE=J10&' +
              'SD_SCHUL_CODE=7530560&' +
              `GRADE=${_grade}&` +
              `CLASS_NM=${_class}&` +
              `TI_FROM_YMD=${date.split('-').join('')}&` +
              `TI_TO_YMD=${date.split('-').join('')}`,
          );

          const { data } = response;
          if ('hisTimetable' in data) {
            const { hisTimetable } = data;
            const { row: result } = hisTimetable[1];

            const dailyTimetable = {
              date,
              grade: _grade,
              class: _class,
              sequence: result
                .sort((a: any, b: any) => a.PERIO - b.PERIO)
                .map((r: any) => {
                  const subject = r.ITRT_CNTNT.replace(/\[보강\]\*/i, '');
                  if (subject in aliases) return aliases[subject];
                  return subject;
                }),
            };

            timetable.push(dailyTimetable);
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

    await this.timetableModel.insertMany(timetable);
    return 'ok';
  }
}
