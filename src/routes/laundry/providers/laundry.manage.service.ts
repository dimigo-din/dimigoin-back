import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Model, Types } from "mongoose";

import {
  Laundry,
  LaundryDocument,
  LaundryTimetable,
  LaundryTimetableDocument,
} from "src/schemas";

import { StayManageService } from "../../stay/providers";
import { CreateLaundryDto, CreateLaundryTimetableDto } from "../dto";

@Injectable()
export class LaundryManageService {
  constructor(
    @InjectModel(Laundry.name)
    private laundryModel: Model<LaundryDocument>,

    @InjectModel(LaundryTimetable.name)
    private laundryTimetableModel: Model<LaundryTimetableDocument>,

    private stayManageService: StayManageService,
  ) {}

  async getAllLaundry(): Promise<LaundryDocument[]> {
    return await this.laundryModel
      .find()
      .sort({ gender: -1 })
      .sort({ floor: 1 })
      .sort({ position: 1 });
  }

  async getLaundry(laundryId: Types.ObjectId): Promise<LaundryDocument> {
    const laundry = await this.laundryModel.findById(laundryId);
    if (!laundry)
      throw new HttpException("해당 세탁기가 존재하지 않습니다.", 404);

    return laundry;
  }

  async createLaundry(data: CreateLaundryDto): Promise<LaundryDocument> {
    const ifLaundryExists = await this.laundryModel.findOne(data);

    if (ifLaundryExists)
      throw new HttpException("같은 정보의 세탁기가 존재합니다.", 403);

    return this.laundryModel.create(data);
  }

  async updateLaundryTimetable(
    data: CreateLaundryTimetableDto,
  ): Promise<LaundryTimetableDocument> {
    const laundryTimetable = this.laundryTimetableModel.findOneAndUpdate(
      {
        laundry: data.laundryId,
        isStaySchedule: data.isStaySchedule,
      },
      {
        $set: data,
      },
      {
        upsert: true,
        new: true,
      },
    );

    return laundryTimetable;
  }

  async getAllLaundryTimetables(): Promise<LaundryTimetableDocument[]> {
    const isTodayStay = await this.stayManageService.isStay();

    return await this.laundryTimetableModel
      .find({ isStaySchedule: isTodayStay })
      .populate("laundry")
      .populate("student");
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteLaundryApplications() {
    return await this.laundryTimetableModel.updateMany(
      {},
      { $set: { "sequence.$[].student": null } },
    );
  }
}
