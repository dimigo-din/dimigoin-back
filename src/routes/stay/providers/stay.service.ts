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

  async getCurrentStay(): Promise<StayDocument> {
    const currentStay = await this.stayManageService.getCurrentStay();

    return currentStay;
  }

  async getCurrentStayApplications(): Promise<StayApplicationDocument[]> {
    const currentStay = await this.stayManageService.getCurrentStay();

    const stayApplications = await this.stayApplicationModel
      .find({
        stay: currentStay._id,
      })
      .populate({
        path: "student",
        select: "name grade class number",
      });

    return stayApplications;
  }

  async applyStay(
    student: StudentDocument,
    data: ApplyStayDto,
  ): Promise<StayApplicationDocument> {
    const stay = await this.canStayApply(student);

    return this.stayManageService.applyStudentStay(student._id, stay._id, data);
  }

  async cancelStay(student: StudentDocument): Promise<StayApplicationDocument> {
    const stay = await this.canStayApply(student);

    return this.stayManageService.cancelStudentStay(student._id, stay._id);
  }

  async applyStayOutgo(
    student: StudentDocument,
    application: ApplyStayOutgoDto,
  ): Promise<StayOutgoDocument> {
    const stay = await this.canStayApply(student);

    return this.stayManageService.applyStudentStayOutgo(
      student._id,
      stay._id,
      application,
    );
  }

  async cancelStayOutgo(
    student: StudentDocument,
    stayOutgoId: Types.ObjectId,
  ): Promise<StayOutgoDocument> {
    const stay = await this.canStayApply(student);

    return this.stayManageService.cancelStudentStayOutgo(
      student._id,
      stay._id,
      stayOutgoId,
    );
  }

  async canStayApply(student: StudentDocument): Promise<StayDocument> {
    const currentStay = await this.stayManageService.getCurrentStay();

    const now = moment();
    if (
      !now.isBetween(
        stringDateTimeToMoment(currentStay.duration[student.grade - 1].start),
        stringDateTimeToMoment(currentStay.duration[student.grade - 1].end),
        undefined,
        "[)",
      )
    )
      throw new HttpException("해당 학년의 신청기간이 아닙니다.", 403);

    return currentStay;
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
}
