import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Model, UpdateWriteOpResult } from "mongoose";
import {
  ApplyLaundryDto,
  CreateWasherDto,
  EditWasherDto,
} from "../dto/laundry.dto";
import { StudentDocument, Washer, WasherDocument } from "src/schemas";
import { StayService } from "../../stay/providers/stay.service";

@Injectable()
export class LaundryService {
  constructor(
    @InjectModel(Washer.name)
    private washerModel: Model<WasherDocument>,

    private stayService: StayService,
  ) {}

  async getAllWashers(): Promise<WasherDocument[]> {
    const washers = await this.washerModel.find();
    return washers;
  }

  async createWasher(data: CreateWasherDto): Promise<WasherDocument> {
    const existingWasher = await this.washerModel.findOne({ name: data.name });
    if (existingWasher)
      throw new HttpException("해당 세탁기가 이미 존재합니다.", 404);

    const timetable = Array(7).fill({});
    const washer = new this.washerModel({
      ...data,
      timetable,
    });

    await washer.save();

    return washer;
  }

  async editWasher(data: EditWasherDto): Promise<WasherDocument> {
    const washer = await this.washerModel.findOne({ name: data.name });
    if (!washer)
      throw new HttpException("해당 세탁기가 존재하지않습니다.", 404);

    washer.grade = data.grade;

    await washer.save();

    return washer;
  }

  async getAvailable(user: StudentDocument): Promise<WasherDocument[]> {
    const isStay = await this.stayService.isStay(new Date());

    const washers = await this.washerModel
      .find({
        gender: user.gender,
        grade: !isStay ? { $elemMatch: { $eq: user.grade } } : null,
      })
      .populate("timetable");

    console.log(washers);
    return washers;
  }

  async getMyLaundry(user: StudentDocument): Promise<object | boolean> {
    const washer = await this.washerModel.findOne({
      "timetable.$id": user._id,
    });
    if (!washer) return false;

    console.log(washer.populate(user._id.toString));

    for (let j = 0; j < 7; j++) {
      if (washer.timetable[j]) {
        if (washer.timetable[j].equals(user._id))
          return {
            time: j + 1,
            washer,
          };
      }
    }
  }

  async applyLaundry(
    data: ApplyLaundryDto,
    user: StudentDocument,
  ): Promise<WasherDocument> {
    const currentHour = new Date().getHours();

    if (currentHour < 8)
      throw new HttpException("세탁 신청은 아침 8시부터 가능합니다.", 404);

    const existingLaundry = await this.washerModel.findOne({
      timetable: { $elemMatch: { user: user._id } },
    });
    if (existingLaundry)
      throw new HttpException("이미 세탁을 신청했습니다.", 404);

    const washer = await this.washerModel.findOne({ name: data.name });
    const isStay = await this.stayService.isStay(new Date());

    if (!washer)
      throw new HttpException("해당 세탁기가 존재하지 않습니다.", 404);
    if (washer.gender !== user.gender)
      throw new HttpException("성별에 맞는 기숙사인지 다시 확인해주세요.", 404);
    if (!washer.grade.includes(user.grade) && !isStay)
      throw new HttpException("신청 가능한 학년이 아닙니다.", 404);

    const maxApplyTime = isStay ? 7 : 5; // 평일에 5타임, 주말에 7타임

    if (data.time < maxApplyTime) {
      if (washer.timetable[data.time])
        throw new HttpException("이미 예약되어 있는 시간대입니다.", 404);
      washer.timetable[data.time] = user._id;
    } else throw new HttpException("신청 가능한 시간이 아닙니다.", 404);

    await washer.save();

    return washer;
  }

  async cancelLaundry(user: StudentDocument): Promise<UpdateWriteOpResult> {
    /*
    const washer = await this.washerModel.findOne({
      timetable: { $elemMatch: user._id },
    });
    if (!washer) throw new HttpException("취소할 세탁신청이 없습니다.", 404);

    for (let j = 0; j < 7; j++) {
      if (washer.timetable[j]) {
        if (washer.timetable[j].equals(user._id)) washer.timetable[j]};
      }
    }
    await washer.save(); */

    const washer = await this.washerModel.updateOne(
      {},
      { $pull: { timetable: user._id } },
      { new: true },
    );

    return washer;
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { name: "RESET_LAUNDRY" })
  async resetLaundry() {
    const washers = await this.washerModel.find();

    const timetable = Array(7).fill({});

    for (let i = 0; i < washers.length; i++) {
      washers[i].timetable = timetable;
      await washers[i].save();
    }
  }
}
