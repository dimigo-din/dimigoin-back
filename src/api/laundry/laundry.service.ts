import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApplyLaundryDto, CreateWasherDto, EditWasherDto } from 'src/common/dto';
import { StudentDocument, Washer, WasherDocument } from 'src/common/schemas';

@Injectable()
export class LaundryService {
  constructor(
    @InjectModel(Washer.name)
    private washerModel: Model<WasherDocument>,
  ) {}

  async getAllWashers(): Promise<Washer[]> {
    const washers = await this.washerModel.find();
    return washers;
  }

  async createWasher(data: CreateWasherDto): Promise<Washer> {
    const existingWasher = await this.washerModel.findOne({ name: data.name });
    if (existingWasher)
      throw new HttpException('해당 세탁기가 이미 존재합니다.', 404);

    const timetable = Array(7).fill({});
    const washer = new this.washerModel({
      ...data,
      timetable,
    });

    await washer.save();

    return washer;
  }

  async editWasher(data: EditWasherDto): Promise<Washer> {
    const washer = await this.washerModel.findOne({ name: data.name });
    if (!washer)
      throw new HttpException('해당 세탁기가 존재하지않습니다.', 404);

    washer.grade = data.grade;

    await washer.save();

    return washer;
  }

  async applyLaundry(
    data: ApplyLaundryDto,
    user: StudentDocument,
  ): Promise<Washer> {
    const washer = await this.washerModel.findOne({ name: data.name });

    if (!washer) throw new HttpException('해당 세탁기가 존재하지 않습니다.', 404);
    if (washer.gender !== user.gender) throw new HttpException('성별에 맞는 기숙사인지 다시 확인해주세요.', 404);
    if (!washer.grade.includes(user.grade)) throw new HttpException('신청 가능한 학년이 아닙니다.', 404);

    const isWeekend = new Date().getDay() % 6 === 0;
    const maxApplyTime = isWeekend ? 7 : 5; // 평일에 5타임, 주말에 7타임

    if (data.time < maxApplyTime) {
      if (washer.timetable[data.time].name) throw new HttpException('이미 예약되어 있는 시간대입니다.', 404);
      washer.timetable[data.time] = {
        userId: user._id,
        name: user.name,
        grade: user.grade,
        class: user.class,
      };
    } else throw new HttpException('신청 가능한 시간이 아닙니다.', 404);

    await washer.save();

    return washer;
  }
}
