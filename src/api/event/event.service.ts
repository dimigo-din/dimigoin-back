import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from 'src/common/schemas';
import * as fs from 'fs';
import moment from 'moment';
import * as XLSX from 'xlsx';
import * as path from 'path';

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

  async tempInsert(): Promise<any> {
    // const fileBinary = fs.readFileSync(
    //   path.resolve(__dirname, '../../../data.xlsx'),
    // );
    // const workbook = XLSX.read(fileBinary, { type: 'buffer' });
    // const fileData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    // return fileData;

    //return "ok";
    /*const readExcel = async () => {
      return new Promise((resolve, reject) => {
        readXlsxFile('./data/data.xlsx').then((rows) => {
          resolve(rows);
        });
      });
    };

    const app = async () => {
      const rows = await readExcel();
      const startPotition = 3;
      let time = moment("00:00:00", "HH:mm:ss");

      let data = [];
      let prevTime = null;
      let prevName = null;

      const mapData = {
        2: {
          grade: 1,
          type: 0,
        },
        3: {
          grade: 2,
          type: 0,
        },
        4: {
          grade: 3,
          type: 0,
        },
        6: {
          grade: 1,
          type: 1,
        },
        7: {
          grade: 2,
          type: 1,
        },
        8: {
          grade: 3,
          type: 1,
        },
      };

      for (const col of [2, 3, 4, 6, 7, 8]) {
        for (let i = startPotition; i < rows.length; i++) {
          const row = rows[i][3];
          if (row || time.format("HH:mm:ss") == "00:00:00") {
            if (prevName) {
              let stack = ["current:"];
              let splitName = prevName.split(' > ');
              if (splitName.length >= 2) {
                let split = splitName[1].split(",").map((item) => item.trim());
                stack.push(...split);
              }

              const dataType = mapData[col];

              data.push({
                name: splitName[0],
                start: prevTime,
                end: time.format("HH:mm:ss"),
                stack: stack,
                grade: dataType.grade,
                type: dataType.type,
              });
            }
            prevName = row;
            prevTime = time.format("HH:mm:ss");
          }
          time.add(5, 'minutes');
        }
      }

      console.log(data);
    };
    app();*/
  }
}
