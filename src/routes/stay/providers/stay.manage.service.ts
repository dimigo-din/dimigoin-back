import { forwardRef, HttpException, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";

import {
  stringDateToMoment,
  stringDateTimeToMoment,
  momentToStringDate,
} from "src/common/utils";
import { UserService } from "src/routes/user/providers";

import {
  Stay,
  StayDocument,
  StayApplication,
  StayApplicationDocument,
  StayOutgo,
  StayOutgoDocument,
} from "src/schemas";

import { ApplyStayDto, ApplyStayOutgoDto, CreateStayDto } from "../dto";

@Injectable()
export class StayManageService {
  constructor(
    @InjectModel(Stay.name)
    private stayModel: Model<StayDocument>,

    @InjectModel(StayApplication.name)
    private stayApplicationModel: Model<StayApplicationDocument>,

    @InjectModel(StayOutgo.name)
    private stayOutgoModel: Model<StayOutgoDocument>,

    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  async getAll(): Promise<StayDocument[]> {
    const stays = await this.stayModel.find();

    return stays;
  }

  async create(data: CreateStayDto): Promise<StayDocument> {
    const stay = new this.stayModel({
      current: false,
      ...data,
    });
    await stay.save();

    return stay;
  }

  async edit(
    stayId: Types.ObjectId,
    data: CreateStayDto,
  ): Promise<StayDocument> {
    const stay = await this.getStay(stayId);
    for (const newKey of Object.keys(data)) {
      stay[newKey] = data[newKey];
    }

    await stay.save();

    return stay;
  }

  async delete(stayId: Types.ObjectId): Promise<StayDocument> {
    const stay = await this.getStay(stayId);
    await this.stayModel.findByIdAndDelete(stayId);

    return stay;
  }

  async get(stayId: Types.ObjectId): Promise<StayDocument> {
    const stay = await this.getStay(stayId);
    return stay;
  }

  async getApplications(
    stayId: Types.ObjectId,
  ): Promise<StayApplicationDocument[]> {
    const stay = await this.getStay(stayId);
    const applications = await this.stayApplicationModel
      .find({
        stay: stay._id,
      })
      .populate({
        path: "user",
      });

    return applications;
  }

  async getCurrentId(): Promise<Types.ObjectId> {
    const stay = await this.stayModel.findOne({ current: true });
    if (!stay) throw new HttpException("활성화된 잔류가 없습니다.", 404);

    return stay._id;
  }

  async setCurrent(stayId: Types.ObjectId): Promise<StayDocument> {
    const stay = await this.getStay(stayId);
    const currentStay = await this.stayModel.findOne({ current: true });
    if (currentStay) {
      currentStay.current = false;
      await currentStay.save();
    }

    stay.current = true;
    await stay.save();

    return stay;
  }

  async deleteCurrent(stayId: Types.ObjectId): Promise<StayDocument> {
    const stay = await this.getStay(stayId);
    stay.current = false;
    await stay.save();

    return stay;
  }

  async applyStudent(
    studentId: Types.ObjectId,
    stayId: Types.ObjectId,
    data: ApplyStayDto,
  ): Promise<StayApplicationDocument> {
    const stay = await this.getStay(stayId);
    const student = await this.userService.getStudent(studentId);

    if (!stay.seat[student.gender + student.grade].includes(data.seat))
      throw new HttpException("해당 학년이 신청 가능한 좌석이 아닙니다.", 403);

    const existingApplication = await this.stayApplicationModel.findOne({
      stay: stay._id,
      user: student._id,
    });
    if (existingApplication)
      throw new HttpException("이미 잔류를 신청했습니다.", 403);

    if (data.seat === "NONE" && !data.reason)
      throw new HttpException("미선택 사유를 입력해주세요.", 403);
    if (data.seat !== "NONE") data.reason = "";

    const application = new this.stayApplicationModel({
      stay: stay._id,
      user: student._id,
      ...data,
    });

    await application.save();

    return application;
  }

  async cancelStudent(
    studentId: Types.ObjectId,
    stayId: Types.ObjectId,
  ): Promise<StayApplicationDocument> {
    const stay = await this.getStay(stayId);
    const student = await this.userService.getStudent(studentId);

    const application = await this.stayApplicationModel.findOneAndDelete({
      stay: stay._id,
      user: student._id,
    });
    if (!application)
      throw new HttpException("취소할 잔류신청이 없습니다.", 404);

    await this.stayOutgoModel.deleteMany({ user: studentId });

    return application;
  }

  async applyStudentOutgo(
    studentId: Types.ObjectId,
    stayId: Types.ObjectId,
    application: ApplyStayOutgoDto,
  ): Promise<StayOutgoDocument> {
    const stay = await this.getStay(stayId);
    const student = await this.userService.getStudent(studentId);

    const stayApplication = await this.stayApplicationModel.findOne({
      stay: stay._id,
      user: student._id,
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
        user: student._id,
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
        user: student._id,
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
        user: student._id,
        status: "W",
        ...application,
      });
      await stayOutgo.save();

      return stayOutgo;
    }
  }

  async cancelStudentOutgo(
    studentId: Types.ObjectId,
    stayId: Types.ObjectId,
    outgoId: Types.ObjectId,
  ): Promise<StayOutgoDocument> {
    const stay = await this.getStay(stayId);
    const student = await this.userService.getStudent(studentId);

    const stayOutgo = await this.stayOutgoModel.findOneAndDelete({
      _id: outgoId,
      stay: stay._id,
      user: student._id,
    });
    if (!stayOutgo)
      throw new HttpException("해당 잔류외출 신청이 없습니다.", 404);

    return stayOutgo;
  }

  async getStay(stayId: Types.ObjectId): Promise<StayDocument> {
    const stay = await this.stayModel.findById(stayId);
    if (!stay) throw new HttpException("해당 잔류 일정이 없습니다.", 404);

    return stay;
  }
}
