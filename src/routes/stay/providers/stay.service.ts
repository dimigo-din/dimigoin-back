import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import moment from "moment";
import { Model, Types } from "mongoose";

import { stringDateTimeToMoment } from "src/common/utils";

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

  async apply(
    student: StudentDocument,
    data: ApplyStayDto,
  ): Promise<StayApplicationDocument> {
    const stay = await this.canApply(student);

    return this.stayManageService.applyStudent(student._id, stay._id, data);
  }

  async cancel(student: StudentDocument): Promise<StayApplicationDocument> {
    const stay = await this.canApply(student);

    return this.stayManageService.cancelStudent(student._id, stay._id);
  }

  async applyOutgo(
    student: StudentDocument,
    application: ApplyStayOutgoDto,
  ): Promise<StayOutgoDocument> {
    const stay = await this.canApply(student);

    return this.stayManageService.applyStudentOutgo(
      student._id,
      stay._id,
      application,
    );
  }

  async cancelOutgo(
    student: StudentDocument,
    outgoId: Types.ObjectId,
  ): Promise<StayOutgoDocument> {
    const stay = await this.canApply(student);

    return this.stayManageService.cancelStudentOutgo(
      student._id,
      stay._id,
      outgoId,
    );
  }

  async canApply(student: StudentDocument): Promise<StayDocument> {
    const stay = await this.stayModel.findOne({ current: true });
    if (!stay) throw new HttpException("신청가능한 잔류일정이 없습니다.", 404);

    const now = moment();
    if (
      !now.isBetween(
        stringDateTimeToMoment(stay.duration[student.grade - 1].start),
        stringDateTimeToMoment(stay.duration[student.grade - 1].end),
        undefined,
        "[)",
      )
    )
      throw new HttpException("해당 학년의 신청기간이 아닙니다.", 403);

    return stay;
  }

  async getStayApplication(id: string): Promise<StayApplicationDocument[]> {
    const stay = await this.stayModel.findById(id);
    if (!stay)
      throw new HttpException("해당 잔류일정이 존재하지 않습니다.", 404);

    const appliers = await this.stayApplicationModel.find({ stay: stay._id });

    return appliers;
  }

  async isStay(): Promise<number> {
    const stay = await this.stayModel.findOne({ current: true });
    if (!stay) return 0;

    const start = moment(stay.start).startOf("day");
    const end = moment(stay.end).endOf("day");
    const target = moment();

    return target.isBetween(start, end, undefined, "[)") ? 1 : 0;
  }

  async getMyStay(student: StudentDocument): Promise<object | boolean> {
    const stay = await this.stayModel.findOne({ current: true });
    if (!stay) return false;

    const application = await this.stayApplicationModel.findOne({
      stay: stay._id,
      user: student._id,
    });
    if (!application) return false;
    if (!application.seat) application.seat = "미선택";
    return { seat: application.seat, reason: application.reason };
  }

  async getMyStayOutgo(student: StudentDocument): Promise<any> {
    const stay = await this.stayModel.findOne({ current: true });
    if (!stay) return false;

    const outgo = await this.stayOutgoModel.find({
      stay: stay._id,
      user: student._id,
    });

    if (outgo.length == 0) return false;

    return outgo;
  }
}
