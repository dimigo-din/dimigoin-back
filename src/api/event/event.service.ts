import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from 'src/common/schemas';
import * as moment from 'moment';
import * as XLSX from 'xlsx';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name)
    private eventModel: Model<EventDocument>,
  ) {}

  async getEvent(grade: number): Promise<Event[]> {
    const isWeekend = new Date().getDay() % 6 === 0;
    const type = isWeekend ? 1 : 0;

    const events = await this.eventModel.find({
      type: type,
      grade: grade,
    });

    return events;
  }

  async uploadEvent(file: Express.Multer.File): Promise<any> {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const fileData = XLSX.utils.sheet_to_json(
      workbook.Sheets[workbook.SheetNames[0]],
    );

    const mapData = [
      {
        name: '평일 1학년',
        grade: 1,
        type: 0,
      },
      {
        name: '평일 2학년',
        grade: 2,
        type: 0,
      },
      {
        name: '평일 3학년',
        grade: 3,
        type: 0,
      },
      {
        name: '잔류 1학년',
        grade: 1,
        type: 1,
      },
      {
        name: '잔류 2학년',
        grade: 2,
        type: 1,
      },
      {
        name: '잔류 3학년',
        grade: 3,
        type: 1,
      },
    ];

    const data = [];
    for (const map of mapData) {
      const time = moment('00:00:00', 'HH:mm:ss');
      let prevName = null;
      let prevTime = null;

      for (const rows of fileData) {
        const row = rows[map.name];

        if (row || time.format('HH:mm:ss') == '00:00:00') {
          if (prevName) {
            const stack = ['current:'];
            const splitName = prevName.split(' > ');
            if (splitName.length >= 2) {
              const split = splitName[1].split(',').map((item) => item.trim());
              stack.push(...split);
            }

            data.push({
              name: splitName[0],
              startTime: prevTime,
              endTime: time.format('HH:mm:ss'),
              stack: stack,
              grade: map.grade,
              type: map.type,
            });
          }
          prevName = row;
          prevTime = time.format('HH:mm:ss');
        }
        time.add(5, 'minutes');
      }
    }

    await this.eventModel.deleteMany({});
    await this.eventModel.insertMany(data);
    return data;
  }
}
