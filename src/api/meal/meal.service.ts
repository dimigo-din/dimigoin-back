import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { Meal, MealDocument, StudentDocument } from 'src/common/schemas';
import { HttpService } from '@nestjs/axios';
import moment from 'moment';
import cheerio from 'cheerio';
import {
  MealTimetable,
  MealTimetableDocument,
} from 'src/common/schemas/meal-timetable.schema';
import { CreateMealTimetableDto } from 'src/common/dto';

@Injectable()
export class MealService {
  constructor(
    @InjectModel(Meal.name)
    private mealModel: Model<MealDocument>,

    @InjectModel(MealTimetable.name)
    private mealTimetableModel: Model<MealTimetableDocument>,

    private readonly httpService: HttpService,
  ) {}

  async getMeal(date: string): Promise<any> {
    if (!moment(date, 'YYYY-MM-DD').isValid()) {
      throw new HttpException('날짜 형식은 YYYY-MM-DD 입니다.', 422);
    }
    const meal = await this.mealModel.findOne({
      date: date,
    });
    if (!meal) {
      throw new HttpException('해당하는 날짜의 급식을 찾을 수 없습니다.', 404);
    }
    return {
      date: moment(meal.date).format('YYYY-MM-DD'),
      breakfast: meal.breakfast,
      lunch: meal.lunch,
      dinner: meal.dinner,
    };
  }

  async getWeeklyMeal(): Promise<any> {
    const meals = await this.mealModel.find({
      date: {
        $gte: moment().startOf('week').toDate(),
        $lte: moment().endOf('week').toDate(),
      },
    });

    const modifiedMeals = [];
    for (const meal of meals) {
      const modifiedMeal = {
        date: moment(meal.date).format('YYYY-MM-DD'),
        breakfast: meal.breakfast,
        lunch: meal.lunch,
        dinner: meal.dinner,
      };
      modifiedMeals.push(modifiedMeal);
    }

    return modifiedMeals;
  }

  private async getMealList(): Promise<any> {
    const response = await this.httpService.axiosRef.get(
      'https://www.dimigo.hs.kr/index.php?mid=school_cafeteria',
    );
    const $ = cheerio.load(response.data);

    const rowList = [];
    const $rowList = $('#siLst thead th');
    for (const [, th] of $rowList.toArray().entries()) {
      rowList.push($(th).text().replace(/\n/g, '').trim());
    }

    const col = [];
    const $colList = $('#siLst tbody tr');
    for (const [, tr] of $colList.toArray().entries()) {
      const $col = $(tr);
      const trList = [];
      for (const [index, td] of $col.find('td').toArray().entries()) {
        trList[rowList[index]] = $(td)
          .text()
          .replace(/\n/g, '')
          .trim()
          .replace(/<(?:.|\n)*?>/gm, '');
      }
      trList['주소'] = $col.find('.title a').attr('href');
      col.push(trList);
    }

    return col;
  }

  private async getMealDetail(url: string): Promise<any> {
    const response = await this.httpService.axiosRef.get(url);

    const $ = cheerio.load(response.data);
    const $mealList = $('.scConDoc').text().split('\n');

    const meal = ['', '', ''];
    for (let $meal of $mealList) {
      $meal = $meal
        .replace(/<(?:.|\n)*?>/gm, '')
        .replace(/\t/g, '')
        .replace(/ /g, '')
        .replace('*', '');
      if ($meal != '' && $meal !== undefined) {
        const type = $meal.split(':')[0];
        const item = $meal.split(':')[1];
        if (item !== undefined) {
          meal[['조식', '중식', '석식'].indexOf(type.substr(0, 2))] =
            item.trim();
        }
      }
    }

    return meal;
  }

  async getAllTimetable(): Promise<MealTimetable[]> {
    const timetables = await this.mealTimetableModel.find();

    return timetables;
  }

  async getMealTimetable(user: StudentDocument): Promise<MealTimetable> {
    const timetable = await this.mealTimetableModel.findOne({
      grade: user.grade,
    });
    if (!timetable)
      throw new HttpException('급식시간표가 아직 추가되지 않았습니다.', 404);

    return timetable;
  }

  async createMealTimetable(
    data: CreateMealTimetableDto,
  ): Promise<MealTimetable> {
    const existingTimetable = await this.mealTimetableModel.findOneAndDelete({
      grade: data.grade,
    });

    const timetable = new this.mealTimetableModel({
      ...data,
    });

    await timetable.save();

    return timetable;
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updateMeal() {
    const mealList = await this.getMealList();
    const list = [];
    for (const meal of mealList) {
      const data = {
        id: 0,
        year: 0,
        month: 0,
        day: 0,
        date: '',
        meal: {
          breakfast: '',
          lunch: '',
          dinner: '',
        },
      };
      data.id = meal['번호'] * 1;
      const splittedTitle = meal['제목'].split('월');
      data.year = moment().year();
      data.month = splittedTitle[0].replace(/[^0-9]/g, '');
      data.day = splittedTitle[1].replace(/[^0-9]/g, '');

      data.month *= 1;
      data.day *= 1;
      if (!isNaN(data.month) && !isNaN(data.day)) {
        if (moment().month() - data.month >= 3) {
          data.year += 1;
        }
        if (moment().month() - data.month <= -3) {
          data.year -= 1;
        }

        data.date = moment(
          `${data.year}-${data.month}-${data.day}`,
          'YYYY-MM-DD',
        ).format('YYYY-MM-DD');

        const mealDetail = await this.getMealDetail(meal['주소']);
        data.meal.breakfast = mealDetail[0];
        data.meal.lunch = mealDetail[1];
        data.meal.dinner = mealDetail[2];

        list.push(data);
      }
    }

    for (const meal of list) {
      await this.mealModel.findOneAndUpdate(
        {
          id: meal.id,
        },
        {
          $set: {
            date: meal.date,
            breakfast: meal.meal.breakfast,
            lunch: meal.meal.lunch,
            dinner: meal.meal.dinner,
          },
        },
        {
          upsert: true,
        },
      );
    }
  }
}
