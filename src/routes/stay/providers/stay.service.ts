import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import moment from "moment";
import { Model, Types } from "mongoose";

import {
  stringDateToMoment,
  stringDateTimeToMoment,
  momentToStringDate,
} from "src/common/utils";

import {
  Stay,
  StayDocument,
  StayApplication,
  StayApplicationDocument,
  StayOutgo,
  StayOutgoDocument,
  StudentDocument,
} from "src/schemas";

import { ApplyStayDto, ApplyStayOutgoDto } from "../dto";

import { StayManageService } from "./stay.manage.service";

@Injectable()
export class StayService {
  constructor(
    @InjectModel(Stay.name)
    private stayModel: Model<StayDocument>,

    @InjectModel(StayApplication.name)
    private stayApplicationModel: Model<StayApplicationDocument>,

    @InjectModel(StayOutgo.name)
    private stayOutgoModel: Model<StayOutgoDocument>,

    private stayManageService: StayManageService,
  ) {}

  async getCurrent(): Promise<StayDocument> {
    const stay = await this.stayModel.findOne({ current: true });
    if (!stay) throw new HttpException("활성화된 잔류가 없습니다.", 404);

    return stay;
  }

  async getCurrentApplications(): Promise<StayApplicationDocument[]> {
    const stay = await this.stayModel.findOne({ current: true });
    if (!stay) throw new HttpException("활성화된 잔류가 없습니다.", 404);

    const stayApplications = await this.stayApplicationModel
      .find({
        stay: stay._id,
      })
      .populate({
        path: "user",
        select: "name grade class number",
      });

    return stayApplications;
  }

  async getStayApplication(id: string): Promise<StayApplicationDocument[]> {
    const stay = await this.stayModel.findById(id);
    if (!stay)
      throw new HttpException("해당 잔류일정이 존재하지 않습니다.", 404);

    const appliers = await this.stayApplicationModel.find({ stay: stay._id });

    return appliers;
  }

  async apply(
    user: StudentDocument,
    data: ApplyStayDto,
  ): Promise<StayApplicationDocument> {
    const stay = await this.stayModel.findOne({ current: true });
    if (!stay) throw new HttpException("신청가능한 잔류일정이 없습니다.", 404);

    const now = moment();
    if (
      !now.isBetween(
        stringDateTimeToMoment(stay.duration[user.grade - 1].start),
        stringDateTimeToMoment(stay.duration[user.grade - 1].end),
        undefined,
        "[)",
      )
    )
      throw new HttpException("해당 학년의 신청기간이 아닙니다.", 403);

    return this.stayManageService.applyStudent(user._id, data);
  }

  async cancel(user: StudentDocument): Promise<StayApplicationDocument> {
    const stay = await this.stayModel.findOne({ current: true });
    if (!stay) throw new HttpException("취소가능한 잔류일정이 없습니다.", 404);

    const now = moment();
    if (
      !now.isBetween(
        stringDateTimeToMoment(stay.duration[user.grade - 1].start),
        stringDateTimeToMoment(stay.duration[user.grade - 1].end),
        undefined,
        "[)",
      )
    )
      throw new HttpException("해당 학년의 취소기간이 아닙니다.", 403);

    return this.stayManageService.cancelStudent(user._id);
  }

  async getMyStay(user: StudentDocument): Promise<object | boolean> {
    const stay = await this.stayModel.findOne({ current: true });
    if (!stay) return false;

    const application = await this.stayApplicationModel.findOne({
      stay: stay._id,
      user: user._id,
    });
    if (!application) return false;
    if (!application.seat) application.seat = "미선택";
    return { seat: application.seat, reason: application.reason };
  }

  async getMyStayOutgo(user: StudentDocument): Promise<any> {
    const stay = await this.stayModel.findOne({ current: true });
    if (!stay) return false;

    const outgo = await this.stayOutgoModel.find({
      stay: stay._id,
      user: user._id,
    });

    if (outgo.length == 0) return false;

    return outgo;
  }

  async applyOutgo(
    user: StudentDocument,
    application: ApplyStayOutgoDto,
  ): Promise<StayOutgoDocument> {
    const stay = await this.stayModel.findOne({ current: true });
    if (!stay) throw new HttpException("신청가능한 잔류일정이 없습니다.", 404);

    const stayApplication = await this.stayApplicationModel.findOne({
      stay: stay._id,
      user: user._id,
    });
    if (!stayApplication)
      throw new HttpException("잔류를 신청하지 않았습니다.", 403);

    const applicationDate = stringDateToMoment(application.date);
    const applicationStart = stringDateTimeToMoment(application.duration.start);
    const applicationEnd = stringDateTimeToMoment(application.duration.end);

    const targetStayOutgo = stay.dates.find((stayDate) =>
      stringDateToMoment(stayDate.date).isSame(applicationDate),
    );
    if (!targetStayOutgo)
      throw new HttpException("올바른 잔류외출 신청이 아닙니다.", 404);

    if (application.free) {
      if (!targetStayOutgo.free)
        throw new HttpException(
          "해당 날짜는 자기개발 외출이 불가능합니다.",
          403,
        );

      const existingStayOutgoFree = await this.stayOutgoModel.findOne({
        stay: stay._id,
        user: user._id,
        date: momentToStringDate(applicationDate),
        free: true,
      });
      if (existingStayOutgoFree)
        throw new HttpException("이미 자기개발 외출을 신청했습니다.", 403);

      const mealLunch = application.meal.lunch;
      delete application["duration"];
      delete application["reason"];
      delete application["meal"];

      const stayOutgo = new this.stayOutgoModel({
        stay: stay._id,
        user: user._id,
        status: "A",
        ...application,
        meal: {
          breakfast: false,
          lunch: mealLunch,
          dinner: false,
        },
      });
      await stayOutgo.save();

      return stayOutgo;
    } else {
      const targetStayOutgoStart = stringDateToMoment(
        targetStayOutgo.date,
      ).startOf("day");
      const targetStayOutgoEnd = stringDateToMoment(targetStayOutgo.date).endOf(
        "day",
      );

      if (
        !applicationStart.isBetween(targetStayOutgoStart, targetStayOutgoEnd) ||
        !applicationEnd.isBetween(targetStayOutgoStart, targetStayOutgoEnd) ||
        applicationEnd.isBefore(applicationStart)
      )
        throw new HttpException("올바른 잔류외출 신청이 아닙니다.", 404);

      const stayOutgo = new this.stayOutgoModel({
        stay: stay._id,
        user: user._id,
        status: "W",
        ...application,
      });
      await stayOutgo.save();

      return stayOutgo;
    }
  }

  async cancelOutgo(
    user: StudentDocument,
    outgoId: Types.ObjectId,
  ): Promise<StayOutgoDocument> {
    const stayOutgoApplication = await this.stayOutgoModel.findOneAndDelete({
      _id: outgoId,
      user: user._id,
    });
    if (!stayOutgoApplication)
      throw new HttpException("해당 잔류외출 신청이 존재하지 않습니다.", 404);

    return stayOutgoApplication;
  }

  async isStay(date: Date): Promise<number> {
    const stay = await this.stayModel.findOne({ current: true });
    if (!stay) return 0;
    const startline = moment(stay.start);
    const endline = moment(stay.end).endOf("day");
    const target = moment(date);

    if (target.isBetween(startline, endline)) return 1;
    return 0;
  }
}
