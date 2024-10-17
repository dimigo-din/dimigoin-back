import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import moment from "moment";
import { Model, Types } from "mongoose";

import { stringDateTimeToMoment } from "src/lib/utils";

import {
  Stay,
  StayDocument,
  StayApplication,
  StayApplicationDocument,
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

    private stayManageService: StayManageService,
  ) {}

  async getCurrentStayApplications(): Promise<StayApplicationDocument[]> {
    const currentStay = await this.stayManageService.getCurrentStay();

    return await this.stayApplicationModel
      .find({
        stay: currentStay._id,
      })
      .populate({
        path: "student",
        select: "name grade class number",
      });
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

    return await this.stayApplicationModel.find({ stay: stay._id });
  }
}
